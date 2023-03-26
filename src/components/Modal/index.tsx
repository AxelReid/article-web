import { Modal as MantineModal, ModalProps } from '@mantine/core'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

interface Props extends Omit<ModalProps, 'onClose' | 'opened'> {
  onClose?: () => void
}

const Modal = (
  { children, onClose = () => {}, ...rest }: Props,
  ref: React.Ref<unknown>
) => {
  const [isOpened, setOpened] = useState(false)

  const open = () => setOpened(true)
  const close = () => {
    onClose()
    setOpened(false)
  }

  useImperativeHandle(ref, () => ({
    open,
    close,
    opened: isOpened,
  }))

  return (
    <MantineModal
      opened={isOpened}
      onClose={close}
      zIndex={2}
      overlayProps={{ blur: 8 }}
      {...rest}
    >
      {children}
    </MantineModal>
  )
}

export default forwardRef(Modal)
