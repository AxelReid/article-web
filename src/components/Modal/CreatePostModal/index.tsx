import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { PostEditQuery, usePostEditQuery } from '~/graphql'
import { ModalMutableRefProps } from '~/types/modalRef'
import Modal from '..'
import Content from './Content'

const CreatePostModal = ({}, ref: React.Ref<unknown | null>) => {
  const modalRef: ModalMutableRefProps = useRef(null)
  const { refetch } = usePostEditQuery({ skip: true })
  const [edit, setEdit] = useState<PostEditQuery['post'] | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const close = () => modalRef.current?.close()
  useImperativeHandle(ref, () => ({
    open: async (postId?: number) => {
      modalRef.current?.open()

      // if (postId === edit?.id) return
      if (postId) {
        setLoading(true)
        const post = await refetch({ postId })
        setEdit(post.data.post)
        setLoading(false)
      } else if (edit) setEdit(undefined)
    },
    close,
  }))

  return (
    <Modal
      closeOnClickOutside={false}
      size='lg'
      ref={modalRef}
      title={edit ? 'Update' : 'Create' + ' Post'}
    >
      {loading ? 'Loading...' : <Content closeModal={close} edit={edit} />}
    </Modal>
  )
}

export default forwardRef(CreatePostModal)
