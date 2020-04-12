import React, { FC, useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CouponService, Coupon, CouponAnchor } from '../services/CouponService'
import { useShop, useUser } from '../utils/hooks'

export const ShopDetail: FC<{}> = () => {
  const couponService = CouponService.getInstance()

  const { shopId } = useParams() as { shopId: string }

  const user = useUser()
  const shop = useShop(shopId)
  const [coupons, setCoupons] = useState<Array<Coupon> | null>(null)
  const { current: internals } = useRef({
    couponAnchor: null as CouponAnchor
  })

  useEffect(() => {
    if (shop == null) {
      setCoupons(null)
      internals.couponAnchor = null
      return
    }

    ;(async () => {
      const { coupons, anchor } = await couponService.fetchCoupons({
        shopId,
        anchor: internals.couponAnchor
      })
      setCoupons(coupons)
      internals.couponAnchor = anchor
    })()
  }, [shop])

  return shop == null ? (
    <>
      <p>ショップ情報を読み込み中</p>
    </>
  ) : (
    <>
      <h2>ショップ: {shop.name}</h2>
      <p>{shop.description}</p>
      {user != null && (
        <>
          <p>
            <Link to={`/shops/${shopId}/edit`}>お店の情報を編集する</Link>
          </p>
          <h3>クーポンのリスト</h3>
          <p>
            <Link to={`/shops/${shopId}/coupons/new`}>クーポンを新しく作成する</Link>
          </p>
          {coupons != null &&
            coupons.map((c) => (
              <div key={c.id}>
                <Link to={`/shops/${shopId}/coupons/${c.id}`}>{c.title}</Link>
              </div>
            ))}
          {coupons != null && coupons.length === 0 && <p>クーポンが登録されていません。</p>}
        </>
      )}
    </>
  )
}
