import React, { useState } from 'react'
import Box from '@mui/material/Box'

import InitWizard from './InitWizard'
import Quiz from './Quiz'
import { Option } from './QuestionCard'

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


const OverView: React.FC<Props> = () => {
  return null
}

const QuizWizard = () => {
  const [
    init,
    quiz,
    overview,
    result
  ] = sequence
  const [quizStep, setQuizStep] = useState<string>(init)

  return <Box sx={{
    height: 'calc(100vh - 52px )',
    padding: '70px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    {init === quizStep && <InitWizard onNext={setQuizStep} next={quiz} />}
    {quiz === quizStep && <Quiz onNext={setQuizStep} next={overview} />}
    {overview === quizStep && <OverView onNext={setQuizStep} next={init} />}
  </Box>
}

export default QuizWizard
