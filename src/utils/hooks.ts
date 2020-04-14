import { useState, useEffect } from 'react'
import { Shop, ShopService } from '../services/ShopService'
import { CouponService, Coupon } from '../services/CouponService'
import { AuthService, User } from '../services/AuthService'
import { useHistory } from 'react-router-dom'

export function useShop(shopId: string): Shop | null {
  const shopService = ShopService.getInstance()
  const [shop, setShop] = useState<Shop | null>(null)
  useEffect(() => {
    ;(async () => {
      setShop(await shopService.fetchShop(shopId))
    })()
  }, [shopId])

  return shop
}

export function useCoupon(shopId: string, couponId: string, watch: boolean = false): Coupon | null {
  const couponService = CouponService.getInstance()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  useEffect(() => {
    if (watch) {
      return couponService.watchCoupon(shopId, couponId, setCoupon)
    } else {
      couponService.fetchCoupon(shopId, couponId).then(setCoupon)
    }
  }, [shopId, couponId])

  return coupon
}

export function useUser(callback?: (user: User | null) => void): User | null {
  const authService = AuthService.getInstance()
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    return authService.onAuthStateChanged((user) => {
      callback?.(user)
      setUser(user)
    })
  }, [])
  return user
}

export function useRequireSignedIn(): void {
  const history = useHistory()

  useEffect(() => {
    return AuthService.getInstance().onAuthStateChanged((user) => {
      if (user == null) {
        history.replace('/')
      }
    })
  }, [])
}
