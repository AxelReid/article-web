import { Box, Button, Container, Divider } from '@mantine/core'
import { NextPage } from 'next'
import { useRef } from 'react'
import CreatePostModal from '~/components/Modal/CreatePostModal'
import { ModalMutableRefProps } from '~/types/modalRef'
import NavBar from '../components/NavBar'
import { useMeQuery, usePostsQuery } from '~/graphql'
import withApollo from '~/utils/withApollo'
import PostItem from '~/components/PostItem'
import React from 'react'

const Home: NextPage = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  })
  const { data: user } = useMeQuery()

  const modalRef: ModalMutableRefProps<number> = useRef(null)

  return (
    <>
      <NavBar />
      <Container size='lg' mt='xl'>
        <Box my='lg'>
          {loading && !data?.posts.posts ? (
            'Loading...'
          ) : !loading && !data?.posts.posts ? (
            'No data to show'
          ) : (
            <>
              {data?.posts.posts.map((post, i) => (
                <React.Fragment key={post.id}>
                  {i ? <Divider key={'divider-' + i} my={'xl'} /> : null}
                  <PostItem
                    key={'item-' + post.id}
                    userId={user?.me?.id}
                    post={post}
                    openEdit={() => modalRef.current?.open(post.id)}
                  />
                </React.Fragment>
              ))}
            </>
          )}
        </Box>
        {!!data?.posts.hasMore && (
          <Button
            mb='xl'
            variant='subtle'
            display='flex'
            mx='auto'
            loading={loading}
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  cursor:
                    data.posts.posts[data.posts.posts.length - 1].createdAt,
                },
              })
            }}
          >
            {loading ? 'Loading...' : 'Load more'} ({data.posts.posts.length})
          </Button>
        )}
      </Container>
      {user?.me && <CreatePostModal ref={modalRef} />}
    </>
  )
}
export default withApollo({ ssr: true })(Home as any)
