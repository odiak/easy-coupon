import React, { FC, useEffect } from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'
import { ShopDetail } from './ShopDetail'
import { NewShop } from './NewShop'
import { CouponDetail } from './CouponDetail'
import { EditShop } from './EditShop'
import { NewCoupon } from './NewCoupon'
import { EditCoupon } from './EditCoupon'
import { css, Global } from '@emotion/core'
import styled from '@emotion/styled'
import { Footer } from './Footer'
import { Header } from './Header'
import { AuthService } from '../services/AuthService'
import { PrivacyPolicy } from './PrivacyPolicy'

const globalStyles = css`
  html {
    font-family: sans-serif;
    background: #f5f5f5;
    height: 100%;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    background: #fff;
  }

  a:link,
  a:visited {
    color: mediumblue;
  }
`

const ContentContainer = styled.div`
  padding: 10px;
`

export const App: FC<{}> = () => {
  useEffect(() => {
    AuthService.getInstance().handleRedirectResult()
  }, [])

  return (
    <BrowserRouter>
      <>
        <Global styles={globalStyles} />
        <Header />
        <ContentContainer>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/shops/new" component={NewShop} />
            <Route exact path="/shops/:shopId" component={ShopDetail} />
            <Route exact path="/shops/:shopId/edit" component={EditShop} />
            <Route exact path="/shops/:shopId/coupons/new" component={NewCoupon} />
            <Route exact path="/shops/:shopId/coupons/:couponId" component={CouponDetail} />
            <Route exact path="/shops/:shopId/coupons/:couponId/edit" component={EditCoupon} />
            <Route path="/privacy-policy" component={PrivacyPolicy} />
            <Route component={NotFound} />
          </Switch>
        </ContentContainer>
        <Footer />
      </>
    </BrowserRouter>
  )
}
