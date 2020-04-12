import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { CouponService } from '../services/CouponService'
import { useParams, useHistory } from 'react-router-dom'

type Values = { title: string; description: string }

export const NewCoupon: FC<{}> = () => {
  const { shopId } = useParams() as { shopId: string }
  const couponService = CouponService.getInstance()
  const history = useHistory()

  const { register, handleSubmit, errors } = useForm<Values>()

  const onSubmit = async (values: Values) => {
    const { couponId } = await couponService.createCoupon(shopId, values)
    history.push(`/shops/${shopId}/coupons/${couponId}`)
  }

  return (
    <>
      <h2>クーポンを作成する</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>タイトル</label>
          <input type="text" name="title" ref={register({ required: true })} />
          {errors.title && <p>タイトルを入力してください。</p>}
        </div>
        <div>
          <label>説明など</label>
          <textarea name="title" ref={register()}></textarea>
        </div>
        <button type="submit">作成する</button>
      </form>
    </>
  )
}
