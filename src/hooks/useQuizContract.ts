import { useEffect, useState } from 'react'
import { Contract } from 'web3-eth-contract'
import { AbiItem } from 'web3-utils'

import QuizToken from '../../build/contracts/QuizToken.json'
import useMetamask from './useMetamask'

type Network = {
  events: any
  links: any
  address: string
  transactionHash: string
}

const useQuizContract = () => {
  const [quizToken, setQuizToken] = useState<Contract | undefined>()
  const [quizTokenAdress, setQuizTokenAddress] = useState<string | undefined>()

  const { web3, netId } = useMetamask()
  const depthsDefined = typeof web3 !== 'undefined' && typeof netId !== 'undefined'

  useEffect(() => {
    if (!depthsDefined) return

    try {
      const network =  (QuizToken.networks as any)[netId] as Network
      const token = new web3.eth.Contract(
        QuizToken.abi as AbiItem[],
        network.address
      )
      const quizTokenAddress = network.address

      setQuizToken(token)
      setQuizTokenAddress(quizTokenAddress)
    } catch(e) {
      console.log('Contracts not deployed...', e)
    }
  }, [depthsDefined])

  return {
    quizToken,
    quizTokenAdress
  }
}

export default useQuizContract
