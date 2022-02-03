import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import NavBar from './components/NavBar'
import Alert from './components/Alert'
import QuizWizard from './components/QuizWizard'

import { makeStyles } from '../shared/styles/makeStyles'

const useStyles = makeStyles()(theme => ({
  homePage: {
    padding: theme.spacing(2)
  }
}))

const HomePageClient: React.FC = () => {
  return <>
    <Box sx={{
      width: '100%',
      height: '100vh',
      background: '#f2f2f2',
      padding: '16px'
    }}>
      <NavBar />
      <QuizWizard />
      <Alert />
    </Box>
  </>
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
