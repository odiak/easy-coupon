import { useState, useEffect } from 'react'
import { Shop, ShopServide } from '../services/ShopService'
import { CouponService, Coupon } from '../services/CouponService'
import { AuthService, User } from '../services/AuthService'

export function useShop(shopId: string): Shop | null {
  const shopService = ShopServide.getInstance()
  const [shop, setShop] = useState<Shop | null>(null)
  useEffect(() => {
    ;(async () => {
      setShop(await shopService.fetchShop(shopId))
    })()
  }, [shopId])

  return shop
}

export function useCoupon(shopId: string, couponId: string): Coupon | null {
  const couponService = CouponService.getInstance()
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  useEffect(() => {
    ;(async () => {
      setCoupon(await couponService.fetchCoupon(shopId, couponId))
    })()
  }, [])

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