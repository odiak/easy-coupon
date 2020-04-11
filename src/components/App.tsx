import React, { FC } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home } from './Home'
import { NotFound } from './NotFound'

export const App: FC<{}> = () => {
  return (
    <BrowserRouter>
      <>
        <h1>Easy Coupon</h1>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      </>
    </BrowserRouter>
  )
}
