import React, { useEffect } from 'react'
import { createState, useState } from '@hookstate/core'
import AlertMui, { AlertColor } from '@mui/material/Alert'

type AlertStateProps = {
  type: AlertColor
  message: string
}

export const AlertState = createState<AlertStateProps>({
  type: 'info',
  message: ''
})

const Alert = () => {
  const [open, setOpen] = React.useState(false)
  const [lastMessage, setLastMessage] = React.useState('')
  const state = useState<AlertStateProps>(AlertState)
  const { type, message } = state.get()

  useEffect(() => {
    if (message.length) {
      setLastMessage(message)
      setOpen(true)

      setTimeout(() => {
        state.set({ type, message: '' })
      }, 300)
    }
  }, [message])

  if (!open) return null

  return <>
    <AlertMui
      onClose={() => {
        setOpen(false)
        setLastMessage('')
      }}
      sx={{
        position: 'absolute',
        left: '16px',
        bottom: '16px'
      }}
      severity={type as unknown as AlertColor}
    >
      {lastMessage}
    </AlertMui>
  </>
}

export default Alert
