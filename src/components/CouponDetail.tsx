import React, { FC } from 'react'
import { useParams } from 'react-router-dom'
import QRCode from 'qrcode.react'

export const CouponDetail: FC<{}> = () => {
  const { shopId, couponId } = useParams() as { shopId: string; couponId: string }

  return (
    <>
      <QRCode value={`${location.origin}/shops/${shopId}/coupons/${couponId}`} />
    </>
  )
}
