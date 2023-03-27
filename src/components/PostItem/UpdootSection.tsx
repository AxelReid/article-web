import { Stack, ActionIcon, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import { PostSnippetFragment, useVoteMutation } from '~/graphql'

interface Props {
  post: PostSnippetFragment
  isAuthed: boolean
}

type LoadingType = 'up' | 'down' | null

const UpdootSection: React.FC<Props> = ({ post, isAuthed }) => {
  const [mutate, { data }] = useVoteMutation({
    // update: (cache, { data: incoming }) =>
    //   updateFragment(post.id, cache, incoming?.vote),
  })
  const sum = data?.vote.updatedPoints ?? post.points
  const status = data?.vote.value ?? post.updoots.value

  const [loading, setLoading] = useState<LoadingType>(null)

  const handleLoading = (state: LoadingType = null) => setLoading(state)

  const vote = useCallback(
    async (action: LoadingType) => {
      const notifyErr = (err: string) =>
        showNotification({
          color: 'red',
          message: err,
        })
      if (!isAuthed) {
        notifyErr('Login first!')
        return
      }
      try {
        handleLoading(action)
        await mutate({
          variables: { postId: post.id, value: action === 'up' ? 1 : -1 },
        })
      } catch (error: any) {
        notifyErr(error?.message)
      } finally {
        handleLoading()
      }
    },
    [mutate, post.id, isAuthed]
  )

  return (
    <Stack spacing={0} align='center'>
      <ActionIcon
        disabled={!isAuthed}
        opacity={isAuthed ? 1 : 0.5}
        size='sm'
        onClick={() => vote('up')}
        loading={loading === 'up'}
        loaderProps={{ w: 12, h: 12 }}
        variant={!isAuthed ? 'transparent' : status === 1 ? 'light' : 'subtle'}
        color={status === 1 ? 'green' : 'gray'}
      >
        <IconChevronUp />
      </ActionIcon>
      <Text fz='sm' fw={500} color={sum > 0 ? 'cyan' : sum < 0 ? 'red' : ''}>
        {sum}
      </Text>
      <ActionIcon
        disabled={!isAuthed}
        opacity={isAuthed ? 1 : 0.5}
        size='sm'
        onClick={() => vote('down')}
        loading={loading === 'down'}
        loaderProps={{ w: 12, h: 12 }}
        variant={!isAuthed ? 'transparent' : status === -1 ? 'light' : 'subtle'}
        color={status === -1 ? 'red' : 'gray'}
      >
        <IconChevronDown />
      </ActionIcon>
    </Stack>
  )
}

export default UpdootSection
