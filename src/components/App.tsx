import React, { FC } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { ShopDetail } from './ShopDetail'
import { NewShop } from './NewShop'
import { CouponDetail } from './CouponDetail'
import { EditShop } from './EditShop'

export const App: FC<{}> = () => {
  return (
    <BrowserRouter>
      <>
        <h1>
          <Link to="/">Easy Coupon</Link>
        </h1>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/shops/new" component={NewShop} />
          <Route exact path="/shops/:shopId" component={ShopDetail} />
          <Route exact path="/shops/:shopId/edit" component={EditShop} />
          <Route exact path="/shops/:shopId/coupons/:couponId" component={CouponDetail} />
          <Route component={NotFound} />
        </Switch>
      </>
    </BrowserRouter>
  )
}
