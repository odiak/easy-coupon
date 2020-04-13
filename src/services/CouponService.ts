import memoizeOne from 'memoize-one'
import firebase from 'firebase/app'
import 'firebase/firestore'

export type CouponStatus = 'unpaid' | 'paid' | 'used' | 'canceled'

export type Coupon = {
  id: string
  title: string
  description: string
  status: CouponStatus
  createdAt: Date
}

export type CouponAnchor = firebase.firestore.DocumentSnapshot<any> | null

export type FetchCouponOptions = {
  shopId: string
  limit?: number
  anchor?: CouponAnchor
}

export class CouponService {
  static getInstance = memoizeOne(() => new CouponService())

  private firestore = firebase.firestore()

  async fetchCoupons({
    shopId,
    limit = 50,
    anchor
  }: FetchCouponOptions): Promise<{
    coupons: Array<Coupon>
    anchor: CouponAnchor
  }> {
    let q = this.firestore
      .collection('shops')
      .doc(shopId)
      .collection('coupons')
      .orderBy('createdAt', 'desc')
      .limit(limit)
    if (anchor) {
      q = q.startAfter(anchor)
    }
    const docs = await q.get()
    const coupons = docs.docs.map(docToCoupon)
    const newAnchor = docs.empty ? null : docs.docs[docs.size - 1]
    return { coupons, anchor: newAnchor }
  }

  watchCoupon(shopId: string, couponId: string, callback: (coupon: Coupon) => void): () => void {
    const unsubscribe = this.firestore
      .collection('shops')
      .doc(shopId)
      .collection('coupons')
      .doc(couponId)
      .onSnapshot((doc) => {
        callback(docToCoupon(doc))
      })

    return unsubscribe
  }

  async createCoupon(
    shopId: string,
    couponDraft: Pick<Coupon, 'title' | 'description'>
  ): Promise<{ couponId: string }> {
    const doc = await this.firestore
      .collection('shops')
      .doc(shopId)
      .collection('coupons')
      .add({ ...couponDraft, status: 'unpaid', createdAt: firebase.firestore.Timestamp.now() })
    return { couponId: doc.id }
  }

  async updateStatus(shopId: string, couponId: string, status: CouponStatus): Promise<void> {
    await this.firestore
      .collection('shops')
      .doc(shopId)
      .collection('coupons')
      .doc(couponId)
      .update({ status })
  }
}

function docToCoupon(doc: firebase.firestore.DocumentSnapshot): Coupon {
  const data = doc.data() || {}
  return { id: doc.id, ...data, createdAt: data.createdAt.toDate() } as Coupon
}
