import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import NavBar from './components/NavBar'
import QuizWizard from './components/QuizWizard'
import { makeStyles } from '../shared/styles/makeStyles'
import useMetamask from './hooks/useMetamask'
import useQuizContract from './hooks/useQuizContract'


const useStyles = makeStyles()(theme => ({
  homePage: {
    padding: theme.spacing(2)
  }
}))

const HomePageClient: React.FC = () => {
  const { account } = useMetamask()
  const { quizToken, quizTokenAdress } = useQuizContract()

  useEffect(() => {
    if (quizTokenAdress) console.log(quizTokenAdress)
  }, [quizTokenAdress])

  useEffect(() => {
    const request = async () => {
      const response = await quizToken?.methods.balanceOf(account).call()

      console.log(response)
    }

    if (quizToken) {
      request()
      
      quizToken?.events.QuizResult({
        filter: { _from: account },
        fromBlock: 0
      }, (e: any, ev: any) => console.log(e, ev.returnValues._reward))
    }
  }, [quizToken])

  const submitQuiz = async () => {
    const response = await quizToken?.methods.submitQuiz(
      'sampleSurvey',
      ['option2', 'option1', 'option3']
    ).send({ from: account })

    console.log(response)
  }

  return <Box sx={{
    width: '100%',
    height: '100vh',
    background: '#f2f2f2',
    padding: '16px'
  }}>
    <NavBar />
    <QuizWizard />
  </Box>
}

export const HomePage: React.FC = () => {
  const { classes } = useStyles()
  const [isClientRuntime, setIsClientRuntime] = useState<boolean>(false)

  useEffect(() => {
    setIsClientRuntime(typeof window !== 'undefined')
  }, [])

  return <>
    {isClientRuntime && <HomePageClient />}
    {!isClientRuntime && <div className={classes.homePage}>Hello, world</div>}
  </>
}
