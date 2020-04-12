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
      .orderBy('createdAt')
      .limit(limit)
    if (anchor) {
      q = q.startAfter(anchor)
    }
    const docs = await q.get()
    const coupons = docs.docs.map(docToCoupon)
    const newAnchor = docs.empty ? null : docs.docs[docs.size - 1]
    return { coupons, anchor: newAnchor }
  }

  async fetchCoupon(shopId: string, couponId: string): Promise<Coupon> {
    const doc = await this.firestore
      .collection('shops')
      .doc(shopId)
      .collection('coupons')
      .doc(couponId)
      .get()
    return docToCoupon(doc)
  }
}

function docToCoupon(doc: firebase.firestore.DocumentSnapshot): Coupon {
  const data = doc.data() || {}
  return { id: doc.id, ...data, createdAt: data.createdAt.toDate() } as Coupon
}
