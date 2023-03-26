import { Box, Card, Flex, Text } from '@mantine/core'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { memo } from 'react'
import { PostSnippetFragment } from '~/graphql'
import ActionsSection from './ActionsSection'
import UpdootSection from './UpdootSection'
const TypographyStylesProvider = dynamic(
  () => import('@mantine/core').then((mod) => mod.TypographyStylesProvider),
  { ssr: false }
)

interface Post extends PostSnippetFragment {
  textShort: string
}
interface Props {
  post: Post
  openEdit: () => void
  userId?: number
}
const PostItem: React.FC<Props> = ({ post, openEdit, userId }) => {
  const slug = `post/${post.id}`

  return (
    <Card h='100%' radius='md' bg='transparent' withBorder>
      <Flex gap='sm'>
        <UpdootSection post={post} isAuthed={!!userId} />
        <Box sx={{ flex: 'auto' }}>
          <Text component={Link} href={slug} fw={500} fz='lg'>
            {post.title}
          </Text>
          <Text fz='sm' color='dimmed'>
            {post.creator.username}
          </Text>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{
                __html: post.textShort,
              }}
            />
          </TypographyStylesProvider>
        </Box>
        {userId === post.creator.id ? (
          <ActionsSection id={post.id} openEdit={openEdit} />
        ) : null}
      </Flex>
    </Card>
  )
}

export default memo(PostItem)
