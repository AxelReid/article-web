import { ApolloCache, gql } from '@apollo/client'
import { Stack, ActionIcon, Text } from '@mantine/core'
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react'
import { useCallback, useState } from 'react'
import { PostSnippetFragment, useVoteMutation, VoteResponse } from '~/graphql'

const updateFragment = (
  postId: number,
  cache: ApolloCache<any>,
  incoming: VoteResponse | undefined
) => {
  if (incoming)
    cache.writeFragment({
      id: 'Post:' + postId,
      fragment: gql`
        fragment _ on Post {
          updoots {
            value
            updatedPoints
          }
        }
      `,
      data: {
        updoots: {
          value: incoming.value,
          updatedPoints: incoming.updatedPoints,
        },
      },
    })
}

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
      if (!isAuthed) return
      handleLoading(action)
      await mutate({
        variables: { postId: post.id, value: action === 'up' ? 1 : -1 },
      })
      handleLoading()
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
        variant={status === 1 ? 'light' : 'subtle'}
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
        variant={status === -1 ? 'light' : 'subtle'}
        color={status === -1 ? 'red' : 'gray'}
      >
        <IconChevronDown />
      </ActionIcon>
    </Stack>
  )
}

export default UpdootSection
