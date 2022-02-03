import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'

import useMetamask from '../../hooks/useMetamask'
import useQuizContract from '../../hooks/useQuizContract'
import { Props, Question } from './'

const OverView: React.FC<Props & {
    quizCompleted?: Question[]
  }> = ({
    onNext,
    next,
    quizCompleted
  }) => {
    const { account } = useMetamask()
    const { quizToken } = useQuizContract()
  
    useEffect(() => {  
      if (quizToken) {
        quizToken?.events.QuizResult({
          filter: { _from: account },
          fromBlock: 0
        }, (e: any, ev: any) => console.log(e, ev.returnValues._reward))
      }
    }, [quizToken])
  
    const submitQuiz = async () => {
      try {
        await quizToken?.methods.submitQuiz(
          'sampleSurvey',
          ['option2', 'option1', 'option3']
        ).send({ from: account })
      } catch(e) {
        console.log(e)
      }
    }

    return <Paper><List>
      <ListItem>
        <ListItemText
          primary='Quiz Overview'
        />
      </ListItem>
      {quizCompleted && quizCompleted?.length > 0 && (
        quizCompleted.map((q: Question, id: number) => (
          <div key={id}>
            <ListItem key={id}>
              <ListItemText
                primary={q.text}
                secondary={'Answer: ' + q.answer}
              />
            </ListItem>
          </div>
        ))
      )}
      <ListItem>
        <Button
          variant='contained'
          onClick={() => {
            //  onNext(next)
            submitQuiz()
          }}
          size='small'
        >
          Submit Quiz
        </Button>
      </ListItem>
    </List>
    </Paper>
  }

export default OverView
