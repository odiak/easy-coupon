import memoizeOne from 'memoize-one'
import firebase from 'firebase/app'
import 'firebase/firestore'

export type Shop = {
  id: string
  name: string
  description: string
  ownerUid: string
  createdAt: Date
}

export type FetchShopsOptions = {
  uid: string
}

export class ShopService {
  static getInstance = memoizeOne(() => new ShopService())

  private firestore = firebase.firestore()

  async fetchShop(shopId: string): Promise<Shop> {
    const doc = await this.firestore.collection('shops').doc(shopId).get()
    return docToShop(doc)
  }

  async fetchShops({ uid }: FetchShopsOptions): Promise<{ shops: Array<Shop> }> {
    const qs = await this.firestore
      .collection('shops')
      .where('ownerUid', '==', uid)
      .orderBy('createdAt', 'desc')
      .get()
    const shops = qs.docs.map(docToShop)
    return { shops }
  }

  async createShop(
    shopDraft: Pick<Shop, 'name' | 'description' | 'ownerUid'>
  ): Promise<{ shopId: string }> {
    const doc = await this.firestore
      .collection('shops')
      .add({ ...shopDraft, createdAt: firebase.firestore.Timestamp.now() })
    return { shopId: doc.id }
  }

  async updateShop(shopId: string, update: Pick<Shop, 'name' | 'description'>): Promise<void> {
    await this.firestore.collection('shops').doc(shopId).update(update)
  }
}

function docToShop(doc: firebase.firestore.DocumentSnapshot<any>): Shop {
  const data = doc.data()
  return { id: doc.id, ...data, createdAt: data.createdAt.toDate() }
}
