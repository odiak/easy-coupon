import React, { FC, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import QRCode from 'qrcode.react'
import { useShop, useCoupon, useUser } from '../utils/hooks'
import { CouponStatus, CouponService } from '../services/CouponService'

export const CouponDetail: FC<{}> = () => {
  const { shopId, couponId } = useParams() as { shopId: string; couponId: string }

  const couponService = CouponService.getInstance()

  const shop = useShop(shopId)
  const coupon = useCoupon(shopId, couponId, true)
  const user = useUser()

  const changeStatus = async (status: CouponStatus) => {
    if (!confirm('よろしいですか？')) return

    await couponService.updateStatus(shopId, couponId, status)
  }

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

      {coupon != null && user != null && (
        <>
          <p>
            <Link to={`/shops/${shopId}`}>ショップのページに戻る</Link>
          </p>
          <p>
            <Link to={`/shops/${shopId}/coupons/${couponId}/edit`}>クーポンの情報を編集する</Link>
          </p>
          <p>
            {coupon.status === 'unpaid' ? (
              <>
                <button onClick={() => changeStatus('paid')}>支払い済みにする</button>
              </>
            ) : coupon.status === 'paid' ? (
              <>
                <button onClick={() => changeStatus('used')}>使用済みにする</button>
                <button onChange={() => changeStatus('unpaid')}>未払いに戻す</button>
              </>
            ) : coupon.status === 'used' ? (
              <>
                <button onClick={() => changeStatus('paid')}>未使用に戻す</button>
              </>
            ) : null}
          </p>
        </>
      )}
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
