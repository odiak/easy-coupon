import React, { FC, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useCoupon } from '../utils/hooks'
import { CouponService } from '../services/CouponService'

type Values = {
  title: string
  description: string
}

export const EditCoupon: FC<{}> = () => {
  const { shopId, couponId } = useParams() as { shopId: string; couponId: string }
  const history = useHistory()
  const couponService = CouponService.getInstance()
  const { register, errors, handleSubmit, reset } = useForm<Values>()

  const coupon = useCoupon(shopId, couponId)

  useEffect(() => {
    if (coupon != null) {
      reset(coupon)
    }
  }, [coupon])

  const onSubmit = async (values: Values) => {
    await couponService.updateCoupon(shopId, couponId, values)
    history.push(`/shops/${shopId}/coupons/${couponId}`)
  }

  return (
    <>
      <h2>クーポン情報を編集する</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">タイトル</label>
          <input type="text" name="title" ref={register({ required: true })} />
          {errors.title && <p>タイトルを入力してください。</p>}
        </div>
        <div>
          <label htmlFor="description">説明など</label>
          <textarea name="description" ref={register()} />
        </div>
        <button type="submit">更新する</button>
      </form>
    </>
  )
}
