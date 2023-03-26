import { Container, Title, TypographyStylesProvider } from '@mantine/core'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import CreatePostModal from '~/components/Modal/CreatePostModal'
import NavBar from '~/components/NavBar'
import ActionsSection from '~/components/PostItem/ActionsSection'
import { useMeQuery, usePostQuery } from '~/graphql'
import { ModalMutableRefProps } from '~/types/modalRef'
import withApollo from '~/utils/withApollo'

const Post = () => {
  const router = useRouter()
  const modalRef: ModalMutableRefProps<number> = useRef(null)
  const postId = parseInt(String(router.query.id))
  const { data: user } = useMeQuery()
  const { data } = usePostQuery({
    skip: typeof postId !== 'number',
    variables: { postId },
  })

  return (
    <>
      <NavBar />
      <Container size='lg' mt='xl'>
        <Title order={2} mb='sm'>
          {data?.post?.title}
        </Title>
        <TypographyStylesProvider>
          <div dangerouslySetInnerHTML={{ __html: data?.post?.text || '' }} />
        </TypographyStylesProvider>
        {user?.me?.id === data?.post?.creator.id && (
          <ActionsSection
            id={data?.post?.id as number}
            openEdit={() => modalRef.current?.open(data?.post?.id)}
            onDelete={router.back}
          />
        )}
      </Container>
      <CreatePostModal ref={modalRef} />
    </>
  )
}

export default withApollo({ ssr: true })(Post)
