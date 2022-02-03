import React from 'react'
import { useTimer } from 'react-timer-hook'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardMedia from '@mui/material/CardMedia'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

import { Question } from './'

export type Option = {
  text: string
}

const Timer: React.FC<{
  lifetimeSeconds: number
  onExpire: () => void
}> = ({ lifetimeSeconds, onExpire }) => {
  const expiryTimestamp = new Date()
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + lifetimeSeconds)
  
  const { seconds } = useTimer({
    expiryTimestamp,
    onExpire: () => onExpire()
  })
  
  return <Typography variant='body2' color='text.secondary'>
      Countdown: {seconds}s
  </Typography>
}

const QuestionCard: React.FC<Question & {
  quizTitle: string
  onAnswer: (a: string, i: number) => void
  answerIndex: number
  display: boolean
}> = ({
  quizTitle,
  image,
  text,
  options,
  lifetimeSeconds,
  onAnswer,
  answerIndex,
  display
}) => {
  const [firstAnswer] = options
  const onlifeTimeExpires = () =>
    onAnswer(firstAnswer.text, answerIndex)
  
  if (!display) return null
  
  return <>
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        title={'Quiz: ' + quizTitle}
      />
      <CardMedia
        component='img'
        height='194'
        image={image}
        alt=''
      />
      <CardContent>
        <Timer lifetimeSeconds={lifetimeSeconds} onExpire={onlifeTimeExpires} />
        <Typography variant='body2' color='text.secondary'>
            Question: {text}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <RadioGroup
          aria-labelledby='demo-radio-buttons-group-label'
          defaultValue='female'
          name='radio-buttons-group'
          onChange={a => onAnswer(a.target.value, answerIndex)}
        >
          {options.length > 0 && options.map((o: Option, id: number) =>
            <FormControlLabel
              key={id}
              value={o.text}
              control={<Radio />}
              label={o.text}
            />)}
        </RadioGroup>
      </CardActions>
    </Card>
  </>
}

export default QuestionCard
