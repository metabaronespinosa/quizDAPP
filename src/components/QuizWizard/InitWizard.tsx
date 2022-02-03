import React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import { Props } from './'

const InitWizard: React.FC<Props> = ({ onNext, next }) => {
  return <>
    <Card sx={{ width: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            Take on the daily Quiz and earn $QUIZ from answering correctly!
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant='contained'
          onClick={() => onNext(next)}
          size='small'
        >Start daily Quiz</Button>
      </CardActions>
    </Card>
  </>
}

export default InitWizard
