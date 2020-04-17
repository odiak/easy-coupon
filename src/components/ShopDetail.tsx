import React, { FC, useEffect, useState, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { CouponService, Coupon, CouponAnchor } from '../services/CouponService'
import { useShop, useUser } from '../utils/hooks'
import styled from '@emotion/styled'

const limit = 30

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

    loadCoupons()
  }, [shop])

  const loadCoupons = useCallback(async () => {
    const { coupons: newCoupons, anchor } = await couponService.fetchCoupons({
      shopId,
      anchor: internals.couponAnchor,
      limit
    })
    internals.couponAnchor = anchor
    setCoupons((coupons || []).concat(newCoupons))
  }, [shopId, coupons])

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
          {coupons != null && (
            <>
              {coupons.map((c) => (
                <CouponInfo key={c.id} coupon={c} shopId={shopId} />
              ))}
              {internals.couponAnchor && <button onClick={loadCoupons}>さらに読み込む</button>}
            </>
          )}
          {coupons != null && coupons.length === 0 && <p>クーポンが登録されていません。</p>}
        </>
      )}
    </>
  )
}

const CouponInfoContainer = styled(Link)`
  display: block;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 2px 2px 6px #0009;
  padding: 10px;

  &:link,
  &:visited,
  &:hover {
    color: inherit;
    text-decoration: none;
  }
`

const CouponInfo: FC<{ coupon: Coupon; shopId: string }> = ({ coupon, shopId }) => {
  return (
    <CouponInfoContainer to={`/shops/${shopId}/coupons/${coupon.id}`}>
      <p>{coupon.title}</p>
    </CouponInfoContainer>
  )
}
