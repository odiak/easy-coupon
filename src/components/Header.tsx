import React, { FC } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

const H1 = styled.h1`
  margin: 0;
  padding: 0;
  font-size: 26px;
  text-align: center;
  background: orangered;
  color: #fff;

  a:link,
  a:visited {
    display: block;
    color: inherit;
    text-decoration: none;
    padding: 10px;
  }
`

export const Header: FC<{}> = () => {
  return (
    <H1>
      <Link to="/">かんたんクーポン</Link>
    </H1>
  )
}
