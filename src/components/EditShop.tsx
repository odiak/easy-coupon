import React, { FC, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useShop } from '../utils/hooks'
import { useForm } from 'react-hook-form'
import { ShopService } from '../services/ShopService'

type Values = { name: string; description: string }

export const EditShop: FC<{}> = () => {
  const { shopId } = useParams() as { shopId: string }
  const history = useHistory()
  const shopService = ShopService.getInstance()

  const shop = useShop(shopId)

  const { register, errors, handleSubmit, reset } = useForm<Values>()

  useEffect(() => {
    if (shop != null) {
      reset(shop)
    }
  }, [shop])

  const onSubmit = async (values: Values) => {
    await shopService.updateShop(shopId, values)
    history.push(`/shops/${shopId}`)
  }

  const cancelEditing = () => {
    history.push(`/shops/${shopId}`)
  }

  return (
    <>
      <h2>ショップ情報の編集</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>ショップ名</label>
          <input type="text" name="name" ref={register({ required: true })} />
          {errors.name && <p>ショップ名を入力してください。</p>}
        </div>
        <div>
          <label>説明</label>
          <textarea name="description" ref={register({})}></textarea>
        </div>
        <button onClick={cancelEditing}>キャンセル</button>
        <button type="submit">保存する</button>
      </form>
    </>
  )
}
