import React, { useEffect, useState } from 'react'
import { makeStyles } from '../shared/styles/makeStyles'

import useMetamask from './hooks/useMetamask'
import useQuizContract from './hooks/useQuizContract'

const useStyles = makeStyles()(theme => ({
  homePage: {
    padding: theme.spacing(2)
  }
}))

const HomePageClient: React.FC = () => {
  const {
    isWalletConnected,
    connectWallet,
    account
  } = useMetamask()
  const { quizToken, quizTokenAdress } = useQuizContract()
  
  useEffect(() => {
    if (!isWalletConnected) connectWallet()
  }, [isWalletConnected])

  useEffect(() => {
    if (account) console.log(account)
  }, [account])

  useEffect(() => {
    if (quizTokenAdress) console.log(quizTokenAdress)
  }, [quizTokenAdress])

  useEffect(() => {
    const request = async () => {
      const response = await quizToken?.methods.balanceOf(account).call()

      console.log(response)
    }

    if (quizToken) request()
  }, [quizToken])

  const submitQuiz = async () => {
    // const response = await quizToken?.methods.getQuizAnswers('sampleSurvey').call()
    // console.log(response)
    const response = await quizToken?.methods.submitQuiz(
      'sampleSurvey',
      ['option2', 'option1', 'option3']
    ).send({ from: account })

    console.log(response)
  }

  return <><button onClick={() => submitQuiz()}>Validate Quiz</button></>
}

export const HomePage: React.FC = () => {
  const { classes } = useStyles()
  const [isClientRuntime, setIsClientRuntime] = useState<boolean>(false)

  useEffect(() => {
    setIsClientRuntime(typeof window !== 'undefined')
  }, [])

  return <>
    {isClientRuntime && <HomePageClient />}
    <div className={classes.homePage}>Hello, world</div>
  </>
}
