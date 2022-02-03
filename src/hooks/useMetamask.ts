import { useEffect, useState } from 'react'
import { useState as useAlertState } from '@hookstate/core'
import Web3 from 'web3'

import { AlertState } from '../components/Alert'

declare const window: any

const web3Instance = (typeof window === 'undefined') ? undefined : new Web3(window.ethereum)

const ROPSTEN_HEX = '0x3'

export const useMetamask = () => {
  const [web3] = useState<Web3 | undefined>(web3Instance)
  const [chainId, setChainId] = useState<number | undefined>()
  const [netId, setNetId] = useState<number | undefined>()
  const [account, setAccount] = useState<string | undefined>()
  const [balance, setBalance] = useState('0')
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const alertState = useAlertState(AlertState)

  const setError = (error: any) => {
    alertState.set({
      type: 'error',
      message: error.message
    })
  }

  const getBlockchainData = async () => {
    try {
      const chainId = await web3?.eth.getChainId()
      const netId = await web3?.eth.net.getId()
      const accounts = await web3?.eth.getAccounts() || []
      
      if (!accounts.length) {
        setNetId(netId)
        setAccount(undefined)
        setIsWalletConnected(false)
        
        return false
      }
      
      const [account] = accounts
      
      setChainId(chainId)
      setAccount(account)
      setIsWalletConnected(true)
    } catch (e) {
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  const getAccountBalance = async () => {
    const balance = await web3?.eth.getBalance(account || '') || '0'

    setBalance(balance)
  }

  const connectWallet = async () => {
    try {
      if (netId === 3) {
        await window.ethereum.request({ method: 'eth_requestAccounts' })

        return
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ROPSTEN_HEX }]
      })
    } catch (e) {
      setError(e)
    }
  }

  useEffect(() => {
    if (web3 && web3.eth) getBlockchainData()

    const accountsListener = () => getBlockchainData()
    const networkListener = async (networkId: string) => {
      if (networkId === ROPSTEN_HEX) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' })
        } catch (e) { setError(e) }
      } else {
        alertState.set({
          type: 'error',
          message: 'Wrong network, please switch to Ropsten'
        })
      }
    }

    window.ethereum.on('accountsChanged', accountsListener)
    window.ethereum.on('chainChanged',  networkListener)

    return () => {
      window.ethereum.removeListener('accountsChanged', accountsListener)
      window.ethereum.removeListener('chainChanged', networkListener)
    }
  }, [web3])

  useEffect(() => {
    if (account) getAccountBalance()
  }, [chainId, account])

  return {
    netId,
    chainId,
    account,
    balance,
    web3,
    isWalletConnected,
    connectWallet,
    loading,
    setError
  }
}

export default useMetamask
