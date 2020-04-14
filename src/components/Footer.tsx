import React, { FC } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  text-align: center;
  padding: 10px;
  margin-top: 10px;
  color: #666;
`

export const Footer: FC<{}> = () => {
  return <Container>&copy; 2020 Kaido Iwamoto</Container>
}
