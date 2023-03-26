import { Button, Stack, TextInput } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import {
  CreatePostInput,
  PostEditQuery,
  UpdatePostInput,
  useCreatePostMutation,
  useUpdatePostMutation,
} from '~/graphql'
import { formatGqlErrorMsg } from '~/utils'
import TextEditor from '~/components/TextEditor'

interface Props {
  closeModal: (() => void) | undefined
  edit?: PostEditQuery['post']
}
const notifyErr = (msg: string) => {
  showNotification({
    color: 'red',
    title: formatGqlErrorMsg(msg),
    message: '',
  })
}

const Content: React.FC<Props> = ({ closeModal = () => {}, edit }) => {
  const [create, { loading: createLoading }] = useCreatePostMutation()
  const [update, { loading: updateLoading }] = useUpdatePostMutation()

  const form = useForm<CreatePostInput>({
    initialValues: {
      title: edit?.title || '',
      text: edit?.text || '',
    },
    validate: {
      title: isNotEmpty('Enter title'),
      text: isNotEmpty('Enter text'),
    },
  })
  const submit = async (vals: CreatePostInput | UpdatePostInput) => {
    try {
      if (edit) {
        const res = await update({
          variables: {
            updatePostId: edit.id,
            updatePostInput: vals as UpdatePostInput,
          },
        })
        if (res.errors) {
          notifyErr(res.errors[0].message)
          return
        }
        if (res.data?.updatePost?.id) {
          showNotification({
            color: 'green',
            message: 'Post updated!',
            autoClose: 1500,
          })
          closeModal()
        }
        return
      }
      const res = await create({
        variables: { createPostInput: vals as CreatePostInput },
        update: (cache) => {
          cache.evict({ fieldName: 'posts' })
        },
      })
      if (res.errors) {
        notifyErr(res.errors[0].message)
        return
      }
      if (res.data?.createPost?.id) {
        showNotification({
          color: 'green',
          message: 'New post created!',
          autoClose: 1500,
        })
        closeModal()
      }
    } catch (error: any) {
      showNotification({
        color: 'red',
        message: error?.message,
      })
    }
  }

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <Stack spacing='sm'>
        <TextInput label='Title' {...form.getInputProps('title')} />
        {/* <TextInput label='Text' {...form.getInputProps('text')} /> */}
        <TextEditor
          getContent={(cnt = '') => form.setFieldValue('text', cnt)}
          content={edit?.text || ''}
          title='Content'
          error={form.errors.text as string}
        />
        <Button
          loading={createLoading || updateLoading}
          ml='auto'
          w='fit-content'
          type='submit'
        >
          {edit ? 'Update' : 'Create'} post
        </Button>
      </Stack>
    </form>
  )
}

export default Content
