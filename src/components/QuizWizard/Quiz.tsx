import React, { useEffect, useState } from 'react'

import { Props } from './'
import { Question } from './'
import QuestionCard from './QuestionCard'

const quizEndpoint = '/quiz.json'

const Quiz: React.FC<Props & {
  onQuizCompleted: (q: Question[] | undefined) => void
}> = ({ onNext, next, onQuizCompleted }) => {
  const [questions, setQuestions] = useState<Question[] | undefined>()
  const [quizTitle, setQuizTitle] = useState<string | undefined>()
  const [displayQuestion, setDisplayQuestion] = useState(0)
  const questionsLength = questions?.length
  
  useEffect(() => {
    const getQuizCatalog = async () => {
      // Simulate quizzes are obtained from some kind ok BE (API, Blockchin, ...)
      const {
        questions,
        title,
        image
      } = await fetch(quizEndpoint).then(r => r.json())
  
      setQuestions(questions)
      setQuizTitle(title)
    }
  
    getQuizCatalog()
  }, [])
  
  const onAnswer = (answer: string, answerId: number) => {
    const q = questions && questions.length > 0 ? [...questions] : []
  
    q[answerId].answer = answer
  
    setQuestions(q)
    setDisplayQuestion(++answerId)
  }
  
  useEffect(() => {
    if (displayQuestion === questionsLength) {
      onQuizCompleted(questions)

      onNext(next)
    }
  }, [displayQuestion, questionsLength])
  
  return <>
    {questions && questions.length > 0 && questions
      .map((q: any, id: number) => <QuestionCard
        {...q}
        onAnswer={onAnswer}
        quizTitle={quizTitle}
        key={id}
        answerIndex={id}
        display={displayQuestion === id}
      />)}
  </>
}

export default Quiz
