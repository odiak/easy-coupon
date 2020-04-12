import React, { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ShopService } from '../services/ShopService'
import { useHistory } from 'react-router-dom'
import { useUser, useRequireSignedIn } from '../utils/hooks'

type Values = {
  name: string
  description: string
}

export const NewShop: FC<{}> = () => {
  useRequireSignedIn()

  const shopService = ShopService.getInstance()

  const history = useHistory()

  const { handleSubmit, register, errors } = useForm<Values>()

  const user = useUser()

  const onSubmit = async (values: Values) => {
    if (user == null) return

    const { shopId } = await shopService.createShop({ ...values, ownerUid: user.uid })
    history.push(`/shops/${shopId}`)
  }

  return (
    <>
      <h2>ショップを登録する</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="name">ショップ名</label>
          <input type="text" name="name" ref={register({ required: true })} />
          {errors.name && <p>ショップ名を入力してください。</p>}
        </div>
        <div>
          <label htmlFor="description">説明</label>
          <textarea name="description" ref={register()}></textarea>
        </div>
        <button type="submit">登録</button>
      </form>
    </>
  )
}
