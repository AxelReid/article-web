import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { ModalMutableRefProps } from '~/types/modalRef'
import Modal from '..'
import Content from './Content'

const ForgotPassModal = ({}, ref: React.Ref<unknown | null>) => {
  const modalRef: ModalMutableRefProps = useRef(null)
  const [email, setEmail] = useState('')

  useImperativeHandle(ref, () => ({
    open: (email: string) => {
      setEmail(email)
      modalRef.current?.open()
    },
    close: () => modalRef.current?.close(),
  }))

  return (
    <Modal ref={modalRef} title='Forgot password'>
      <Content email={email} />
    </Modal>
  )
}
export default forwardRef(ForgotPassModal)
