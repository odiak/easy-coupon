import React, { FC, useEffect, useState, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/firestore'

type Shop = { id: string; name: string }
type Coupon = {
  id: string
  title: string
  description: string
  status: 'unpaid' | 'paid' | 'used' | 'canceled'
}

export const ShopDetail: FC<{}> = () => {
  const { firestore } = useMemo(() => ({ firestore: firebase.firestore() }), [])

  const { shopId } = useParams() as { shopId: string }

  const [shop, setShop] = useState<Shop | null>(null)
  const [coupons, setCoupons] = useState<Array<Coupon> | null>(null)
  const { current: internals } = useRef({
    lastCouponSnapshot: null as firebase.firestore.DocumentSnapshot<any> | null
  })

  useEffect(() => {
    ;(async () => {
      const shop = await firestore.collection('shops').doc(shopId).get()
      const id = shop.id
      const { name } = shop.data() as Omit<Shop, 'id'>
      setShop({ id, name })
    })()
  }, [shopId])

  useEffect(() => {
    if (shop == null) {
      setCoupons(null)
      internals.lastCouponSnapshot = null
      return
    }

    ;(async () => {
      let q = firestore
        .collection('shops')
        .doc(shopId)
        .collection('coupons')
        .orderBy('timestamp', 'desc')
        .limit(50)
      const { lastCouponSnapshot } = internals
      if (lastCouponSnapshot != null) {
        q = q.startAfter(lastCouponSnapshot)
      }
      const coupons = await q.get()
      if (coupons.empty) {
        internals.lastCouponSnapshot = null
      } else {
        internals.lastCouponSnapshot = coupons.docs[coupons.docs.length - 1]
      }
      setCoupons(
        coupons.docs.map((c) => {
          const { title, description, status } = c.data()
          return { id: c.id, title, description, status }
        })
      )
    })()
  }, [shop])

  return shop == null ? (
    <>
      <p>ショップ情報を読み込み中</p>
    </>
  ) : (
    <>
      <h2>ショップ: {shop.name}</h2>
      <h3>クーポンのリスト</h3>
      {coupons != null &&
        coupons.map((c) => (
          <div key={c.id}>
            <Link to={`/shops/${shopId}/coupons/${c.id}`}>{c.title}</Link>
          </div>
        ))}
      {coupons != null && coupons.length === 0 && <p>クーポンが登録されていません。</p>}
    </>
  )
}
