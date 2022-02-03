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
  const state = useState<AlertStateProps>(AlertState)
  const { type, message } = state

  useEffect(() => {
    if (message && !open) setOpen(true)
  }, [message, open])

  if (!open) return null

  return <>
    <AlertMui
      onClose={() => setOpen(false)}
      sx={{
        position: 'absolute',
        left: '16px',
        bottom: '16px'
      }}
      severity={type.get() as unknown as AlertColor}
    >
      {message.get()}
    </AlertMui>
  </>
}

export default Alert
