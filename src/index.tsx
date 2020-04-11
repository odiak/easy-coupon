import React from 'react'
import { render } from 'react-dom'
import firebase from 'firebase/app'
import { App } from './components/App'

firebase.initializeApp({
  apiKey: 'AIzaSyBSkXntQyVMlOu42ACuMvWY5suuoOABGts',
  authDomain: 'easy-coupon-76bc2.firebaseapp.com',
  databaseURL: 'https://easy-coupon-76bc2.firebaseio.com',
  projectId: 'easy-coupon-76bc2',
  storageBucket: 'easy-coupon-76bc2.appspot.com',
  messagingSenderId: '868994762029',
  appId: '1:868994762029:web:b4b44963e16e9567c97fa4',
  measurementId: 'G-3DP69J20VM'
})

render(<App />, document.getElementById('app'))
