import React from 'react'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import useMetamask from '../hooks/useMetamask'

const parseAddress = (a: string) => {
  return `${a.substring(0, 5)}...${a.substring(a.length, a.length - 3)}`
}

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  minHeight: '36px',
  maxHeight: '36px'
}))

const NavBar = () => {
  const {
    isWalletConnected,
    connectWallet,
    account
  } = useMetamask()
  
  return <Grid
    container
    sx={{
      boxShadow: '0px 2px 8px rgba(2, 18, 21, 0.1)'
    }}
  >
    <Grid item xs>
      <Item elevation={0}>Rather Labs Quiz Test</Item>
    </Grid>
    <Grid item xs={6}>
      <Item elevation={0} />
    </Grid>
    <Grid item xs>
      <Item elevation={0} sx={{
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      }}>
        {!isWalletConnected && <Button
          disableElevation
          variant='contained'
          sx={{ height: '25px', width: '150px', fontSize: 12 }}
          onClick={() => connectWallet()}
        >
            connect wallet
        </Button>}
        {isWalletConnected && <Button
          disableElevation
          variant='contained'
          sx={{ height: '25px', width: '150px', fontSize: 12 }}
          onClick={() => {}}
        >
          {account && parseAddress(account)}
        </Button>}
      </Item>
    </Grid>
  </Grid>
}

export default NavBar
