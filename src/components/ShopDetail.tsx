import React, { FC, useEffect, useState, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShopServide, Shop } from '../services/ShopService'
import { CouponService, Coupon, CouponAnchor } from '../services/CouponService'

export const ShopDetail: FC<{}> = () => {
  const { shopService, couponService } = useMemo(
    () => ({ shopService: ShopServide.getInstance(), couponService: CouponService.getInstance() }),
    []
  )

  const { shopId } = useParams() as { shopId: string }

  const [shop, setShop] = useState<Shop | null>(null)
  const [coupons, setCoupons] = useState<Array<Coupon> | null>(null)
  const { current: internals } = useRef({
    couponAnchor: null as CouponAnchor
  })

  useEffect(() => {
    ;(async () => {
      const shop = await shopService.fetchShop(shopId)
      setShop(shop)
    })()
  }, [shopId])

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
