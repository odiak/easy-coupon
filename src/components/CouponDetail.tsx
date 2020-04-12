import React, { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'qrcode.react'
import { useShop, useCoupon } from '../utils/hooks'
import { CouponStatus } from '../services/CouponService'

export const CouponDetail: FC<{}> = () => {
  const { shopId, couponId } = useParams() as { shopId: string; couponId: string }

  const shop = useShop(shopId)
  const coupon = useCoupon(shopId, couponId)

  useEffect(() => {}, [shopId, couponId])

  return (
    <>
      <h2>{shop && shop.name} のクーポン</h2>
      {coupon && (
        <>
          <h3>{coupon.title}</h3>
          <p>{coupon.description}</p>
          <CouponStatusDisplay status={coupon.status} />
        </>
      )}
      <QRCode value={`${location.origin}/shops/${shopId}/coupons/${couponId}`} />
    </>
  )
}

const CouponStatusDisplay: FC<{ status: CouponStatus }> = ({ status }) => {
  let statusName: string
  switch (status) {
    case 'unpaid':
      statusName = '未払い'
      break
    case 'paid':
      statusName = '支払い済み'
      break
    case 'used':
      statusName = '使用済み'
      break
    case 'canceled':
      statusName = 'キャンセル済み'
      break
    default:
      statusName = 'unknown'
      break
  }
  return <p>状態: {statusName}</p>
}
