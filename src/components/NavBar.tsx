import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { useState as useAlertState } from '@hookstate/core'

import { AlertState } from './Alert'
import useMetamask, { WRONG_NETWORK } from '../hooks/useMetamask'
import useQuizContract from '../hooks/useQuizContract'

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
  const [balance, setBalance] = useState<string | undefined>()
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>()
  const {
    isWalletConnected,
    connectWallet,
    account
  } = useMetamask()
  const { quizToken } = useQuizContract()
  const state = useAlertState(AlertState)
  const { message } = state
  const switchRopsten = message.get() === WRONG_NETWORK

  useEffect(() => {
    if (quizToken) {
      const request = async() => {
        const tokenNameResponse = await quizToken.methods.symbol().call()
        const response = await quizToken.methods.balanceOf(account).call()

        setTokenSymbol(tokenNameResponse)
        setBalance(Web3.utils.fromWei(response, 'ether'))
      }

      request()
    }
  }, [quizToken])
  
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
      <Item elevation={0}>{balance ? `$${tokenSymbol} Balance: ${balance}` : null}</Item>
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
        {!switchRopsten && isWalletConnected && <Button
          disableElevation
          variant='contained'
          sx={{ height: '25px', width: '150px', fontSize: 12 }}
          onClick={() => {}}
        >
          {account && parseAddress(account)}
        </Button>}
        {switchRopsten && <Button
          disableElevation
          variant='contained'
          sx={{ height: '25px', width: '150px', fontSize: 12 }}
          onClick={() => connectWallet()}
        >
          go Ropsten
        </Button>}
      </Item>
    </Grid>
  </Grid>
}

export default NavBar
