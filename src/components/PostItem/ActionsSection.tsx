import { Stack, ActionIcon } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useDeletePostMutation } from '~/graphql'

interface Props {
  id: number
  openEdit: () => void
  onDelete?: () => void
}

const ActionsSection: React.FC<Props> = ({ id, openEdit, onDelete }) => {
  const [deletePost, { loading }] = useDeletePostMutation()

  return (
    <Stack spacing='xs'>
      <ActionIcon variant='light' color='blue' size='md' onClick={openEdit}>
        <IconEdit size={13} />
      </ActionIcon>
      <ActionIcon
        onClick={async () => {
          await deletePost({
            variables: { deletePostId: id },
            update: (cache, result) => {
              if (!result.data?.deletePost) {
                showNotification({
                  color: 'red',
                  message: "Couldn't delete the post",
                })
                return
              }
              cache.evict({ id: 'Post:' + id })
              if (typeof onDelete === 'function') onDelete()
            },
          })
        }}
        loading={loading}
        variant='light'
        color='red'
        size='md'
      >
        <IconTrash size={13} />
      </ActionIcon>
    </Stack>
  )
}

export default ActionsSection
