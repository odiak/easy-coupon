import React, { FC, useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import { Shop, ShopServide } from '../services/ShopService'

export const Home: FC<{}> = () => {
  const { auth, googleAuthProvider, shopService } = useMemo(
    () => ({
      auth: firebase.auth(),
      googleAuthProvider: new firebase.auth.GoogleAuthProvider(),
      shopService: ShopServide.getInstance()
    }),
    []
  )

  const [pending, setPending] = useState(true)
  const [user, setUser] = useState<firebase.User | null>(null)
  const [shops, setShops] = useState<Array<Shop> | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setPending(false)
      setUser(user)
    })

    return unsubscribe
  }, [auth])

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
    auth.signInWithRedirect(googleAuthProvider)
  }, [auth, googleAuthProvider])

  const signOut = useCallback(() => {
    if (!confirm('ログアウトします。よろしいですか？')) return

    auth.signOut()
  }, [auth])

  return pending ? (
    <>
      <p>読み込み中です</p>
    </>
  ) : user == null ? (
    <>
      <p>
        <button onClick={signInWithGoogle}>Googleアカウントでログイン</button>
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
