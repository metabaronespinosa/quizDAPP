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
  const [lastMessage, setLastMessage] = React.useState<string | undefined>()
  const state = useState<AlertStateProps>(AlertState)
  const { type, message } = state.get()

  useEffect(() => {
    if (lastMessage === message) {
      setOpen(false)

      setTimeout(() => setLastMessage(undefined), 300)
    }
  }, [lastMessage])

  useEffect(() => {
    if (!lastMessage?.length && message?.length && !open) setOpen(true) 
  }, [message, open])

  if (!open) return null

  return <>
    <AlertMui
      onClose={() => {
        setLastMessage(message)
      }}
      sx={{
        position: 'absolute',
        left: '16px',
        bottom: '16px'
      }}
      severity={type as unknown as AlertColor}
    >
      {message}
    </AlertMui>
  </>
}

export default Alert
