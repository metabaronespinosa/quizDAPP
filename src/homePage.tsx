import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import { makeStyles } from '../shared/styles/makeStyles'
import useMetamask from './hooks/useMetamask'
import useQuizContract from './hooks/useQuizContract'

const useStyles = makeStyles()(theme => ({
  homePage: {
    padding: theme.spacing(2)
  }
}))

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

const NavBar = () => {
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
      <Item elevation={0}>connect</Item>
    </Grid>
  </Grid>
}
const MainContent = () => null

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

  // return <><button onClick={() => submitQuiz()}>Validate Quiz</button></>

  return <Box sx={{
    width: '100%',
    height: '100vh',
    background: '#f2f2f2',
    padding: '16px'
  }}>
    <NavBar />
    <MainContent />
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
