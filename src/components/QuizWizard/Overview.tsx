import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'

import useMetamask from '../../hooks/useMetamask'
import useQuizContract from '../../hooks/useQuizContract'
import { Props, Question } from './'

// This should be obtained from some kind of BE (API, Blockchain)
const DAILY_QUIZ = 'sampleSurvey'

const QuizResult: React.FC<{
  loading: boolean,
  reward?: string
}> = ({
  loading,
  reward
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const parsedReward = parseFloat(reward || '0')

  useEffect(() => {
    if (parsedReward > 0) setOpenDialog(true)
  }, [parsedReward])

  return <>
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={loading}
    >
      <CircularProgress color='inherit' />
    </Backdrop>
    <Dialog
      open={!loading && Boolean(reward) && openDialog}
    >
      <DialogTitle>Quiz result:</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem button>
          {parsedReward > 0 ? `Congrats, you just received ${parsedReward}` : 'Good Luck next time! :('}
        </ListItem>
        <ListItem button>
          <Button onClick={() => {
            setOpenDialog(false)

            setTimeout(() => {
              location.reload()
            }, 10000)
          }}>Ok</Button>
        </ListItem>
      </List>
    </Dialog>
  </>
}

const OverView: React.FC<Props & {
  quizCompleted?: Question[]
}> = ({
  onNext,
  next,
  quizCompleted
}) => {
  const { account, setError } = useMetamask()
  const { quizToken } = useQuizContract()
  const [reward, setReward] = useState<string | undefined>()
  const [loadingResult, setLoadingResult] = useState<boolean>(false)
  const [transactionSent, setTransactionSent] = useState<boolean>(false)
  
  useEffect(() => {
    if (transactionSent) {
      quizToken?.events.QuizResult({
        filter: { _from: account },
        fromBlock: 0
      }, (_e: any, ev: any) => {
        setLoadingResult(false)

        setReward(ev.returnValues._reward)
      })
    }
  }, [transactionSent])
  
  const submitQuiz = async () => {
    if (!quizCompleted) return

    setLoadingResult(true)

    try {
      await quizToken?.methods.submitQuiz(
        DAILY_QUIZ,
        quizCompleted?.map((q: Question) => q.answer)
      ).send({ from: account })

      setTransactionSent(true)

    } catch(e) {
      setLoadingResult(false)

      setError(e)
    }
  }

  return <>
    <QuizResult
      loading={loadingResult}
      reward={reward}
    />
    <Paper><List>
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
  </>
}

export default OverView
