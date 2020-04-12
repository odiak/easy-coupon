import memoizeOne from 'memoize-one'
import firebase from 'firebase/app'
import 'firebase/firestore'

export type Shop = {
  id: string
  name: string
}

export type FetchShopsOptions = {
  uid: string
}

export class ShopServide {
  static getInstance = memoizeOne(() => new ShopServide())

  private firestore = firebase.firestore()

  async fetchShop(shopId: string): Promise<Shop> {
    const doc = await this.firestore.collection('shop').doc(shopId).get()
    return docToShop(doc)
  }

  async fetchShops({ uid }: FetchShopsOptions): Promise<{ shops: Array<Shop> }> {
    const qs = await this.firestore.collection('shops').where('ownerUid', '==', uid).get()
    const shops = qs.docs.map(docToShop)
    return { shops }
  }
}

function docToShop(doc: firebase.firestore.DocumentSnapshot<any>): Shop {
  const data = doc.data()
  return { id: doc.id, ...data }
}
