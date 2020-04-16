import React, { FC, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Shop, ShopService } from '../services/ShopService'
import { useUser } from '../utils/hooks'
import { AuthService } from '../services/AuthService'

export const Home: FC<{}> = () => {
  const shopService = ShopService.getInstance()
  const authService = AuthService.getInstance()

  const [pending, setPending] = useState(true)
  const user = useUser(() => {
    setPending(false)
  })
  const [shops, setShops] = useState<Array<Shop> | null>(null)

  useEffect(() => {
    if (user == null) {
      setShops(null)
      return
    }

    ;(async () => {
      const { shops } = await shopService.fetchShops({ uid: user.uid })
      setShops(shops)
    })()
  }, [user])

  const signInWithGoogle = useCallback(() => {
    authService.signIn('google')
  }, [authService])

  const signInWithFacebook = useCallback(() => {
    authService.signIn('facebook')
  }, [authService])

  const signOut = useCallback(() => {
    if (!confirm('ログアウトします。よろしいですか？')) return

    authService.signOut()
  }, [authService])

  return pending ? (
    <>
      <p>読み込み中です</p>
    </>
  ) : user == null ? (
    <>
      <p>お店の方は以下のボタンからログインしてください。</p>
      <p>
        <button onClick={signInWithGoogle}>Googleアカウントでログイン</button>
        <button onClick={signInWithFacebook}>Facebookアカウントでログイン</button>
      </p>
    </>
  ) : (
    <>
      <p>
        ようこそ {user.displayName} さん。
        <button onClick={signOut}>ログアウトする</button>
      </p>

      <h2>お店のリスト</h2>
      <p>
        <Link to="/shops/new">お店を新しく登録する</Link>
      </p>
      {shops != null &&
        shops.map(({ id, name }) => (
          <p key={id}>
            <Link to={`/shops/${id}`}>{name}</Link>
          </p>
        ))}
      {shops != null && shops.length === 0 && <p>お店が登録されていません。</p>}
    </>
  )
}
