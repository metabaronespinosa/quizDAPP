import React, { useState } from 'react'
import Box from '@mui/material/Box'
import { useState as useAlertState } from '@hookstate/core'

import InitWizard from './InitWizard'
import Quiz from './Quiz'
import Overview from './Overview'
import { Option } from './QuestionCard'

import { AlertState } from '../Alert'
import useMetamask, { WRONG_NETWORK } from '../../hooks/useMetamask'

const sequence = [
  'init',
  'quiz',
  'overview',
  'result'
]

export type Props = {
  onNext: (a: string) => void,
  next: string
}

export type Question = {
  image: string
  lifetimeSeconds: number
  text: string
  options: Option[]
  answer?: string
}

const QuizWizard = () => {
  const [
    init,
    quiz,
    overview,
    result
  ] = sequence
  const [quizStep, setQuizStep] = useState<string>(init)
  const [quizCompleted, setQuizCompleted] = useState<Question[] | undefined>()
  const { message } = useAlertState(AlertState)
  const { isWalletConnected } = useMetamask()
  const blockQuiz = !(message.get() === WRONG_NETWORK || !isWalletConnected)

  return <Box sx={{
    height: 'calc(100vh - 52px)',
    padding: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {blockQuiz && init === quizStep && <InitWizard onNext={setQuizStep} next={quiz} />}
    {blockQuiz && quiz === quizStep && <Quiz
      onNext={setQuizStep}
      next={overview}
      onQuizCompleted={setQuizCompleted}
    />}
    {blockQuiz && overview === quizStep && <Overview
      onNext={setQuizStep}
      next={init}
      quizCompleted={quizCompleted}
    />}
  </Box>
}

export default QuizWizard
