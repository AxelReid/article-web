import {
  AspectRatio,
  Badge,
  Box,
  Flex,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { memo, useMemo } from 'react'
import { PostSnippetFragment } from '~/graphql'
const TypographyStylesProvider = dynamic(
  () => import('@mantine/core').then((mod) => mod.TypographyStylesProvider),
  { ssr: false }
)

const images = [
  'https://plus.unsplash.com/premium_photo-1677015055403-2d7b2b424bdc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1587617425953-9075d28b8c46?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1633677658580-2535af0cfb00?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  'https://images.unsplash.com/photo-1561314945-0562f5b6d2c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
]

interface Post extends PostSnippetFragment {
  textShort: string
}
interface Props {
  post: Post
  openEdit: () => void
  userId?: number
}
const PostItem: React.FC<Props> = ({ post }) => {
  const slug = `post/${post.id}`
  const { colorScheme } = useMantineColorScheme()
  const randomImage = useMemo(
    () => images[Math.floor(Math.random() * images.length)],
    []
  )

  const date = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(parseInt(post.createdAt))

  return (
    <Box>
      <Flex align='start' gap='xl' direction={{ base: 'row', xs: 'row' }}>
        <Box>
          {/* <UpdootSection post={post} isAuthed={!!userId} /> */}
          <Flex align='center' gap='sm' mb='md'>
            <Badge
              radius='sm'
              size='md'
              py='sm'
              variant='filled'
              color={colorScheme === 'dark' ? 'gray' : 'dark'}
            >
              design tool
            </Badge>
            <Text fz='xs' fw={600} tt='uppercase' opacity={0.7}>
              {date}
            </Text>
          </Flex>
          <Text
            component={Link}
            href={slug}
            fw={700}
            fz={{ base: 24, sm: 28 }}
            lh={1.2}
          >
            {post.title}
          </Text>
          <TypographyStylesProvider mt='sm'>
            <div
              dangerouslySetInnerHTML={{
                __html: post.textShort,
              }}
            />
          </TypographyStylesProvider>
        </Box>
        <AspectRatio
          ratio={3 / 2.1}
          pos='relative'
          sx={(theme) => ({
            flexShrink: 0,
            borderRadius: theme.radius.md,
            overflow: 'hidden',
          })}
          w={{ base: 200, sm: 250, md: 300 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img width='100%' height='100%' src={randomImage} alt='' />
        </AspectRatio>
      </Flex>
      {/* {userId === post.creator.id ? (
          <ActionsSection id={post.id} openEdit={openEdit} />
        ) : null} */}
    </Box>
  )
}

export default memo(PostItem)
