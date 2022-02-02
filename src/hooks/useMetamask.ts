
import { useEffect, useState } from 'react'
import Web3 from 'web3'

declare const window: any

export const useMetamask = () => {
  const [web3] = useState<Web3>(new Web3(window.ethereum))
  const [netId, setNetId] = useState<number | undefined>()
  const [account, setAccount] = useState<string | undefined>()
  const [balance, setBalance] = useState('0')
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)

  const getBlockchainData = async () => {
    try {
      const netId = await web3.eth.net.getId()
      const accounts = await web3.eth.getAccounts()
 
      if (!accounts.length) {
        setAccount(undefined)
        setIsWalletConnected(true)

        return false
      }

      const [account] = accounts
      
      setNetId(netId)
      setAccount(account)
      setIsWalletConnected(false)
    } catch (_e) {
      console.log(_e)
    } finally {
      setLoading(false)
    }
  }

  const getAccountBalance = async () => {
    const balance = await web3.eth.getBalance(account || '')

    setBalance(balance)
  }

  const connectWallet = () => {
    window.ethereum.request({ method: 'eth_requestAccounts' })
  }

  useEffect(() => {}, [])

  useEffect(() => {
    if (web3 && web3.eth) getBlockchainData()

    const listener = () => getBlockchainData()

    window.ethereum.on('accountsChanged', listener)

    return () => window.ethereum.removeListener('accountsChanged', listener)
  }, [web3])

  useEffect(() => {
    if (account) getAccountBalance()
  }, [netId, account])

  return {
    netId,
    account,
    balance,
    web3,
    isWalletConnected,
    connectWallet,
    loading
  }
}

export default useMetamask
