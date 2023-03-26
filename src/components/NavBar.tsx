import {
  ActionIcon,
  Anchor,
  Button,
  Container,
  Flex,
  Header,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import Link from 'next/link'
import { callbackUrl } from '~/utils/callbackUrl'
import { useLogoutMutation, useMeQuery } from '~/graphql'
import { IconMoon, IconPlus, IconSun } from '@tabler/icons-react'
import { memo, useRef } from 'react'
import { ModalMutableRefProps } from '~/types/modalRef'
import CreatePostModal from './Modal/CreatePostModal'

const NavBar: React.FC = () => {
  const modalRef: ModalMutableRefProps<number> = useRef(null)
  const { data } = useMeQuery()
  const [logout, { client }] = useLogoutMutation()
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const themeIcon =
    colorScheme === 'dark' ? (
      <IconSun size={22} strokeWidth={1.6} />
    ) : (
      <IconMoon size={22} strokeWidth={1.5} opacity={0.7} />
    )

  let content = <></>
  if (data?.me)
    content = (
      <>
        <Text
          onClick={async () => {
            await logout()
            client.resetStore()
          }}
          size='sm'
          fw={500}
          variant='link'
          c='red'
          sx={{ cursor: 'pointer' }}
        >
          Logout
        </Text>
        <Text>{data.me.username}</Text>
        <Button
          size='sm'
          radius='md'
          variant='default'
          leftIcon={<IconPlus width={20} />}
          onClick={() => modalRef.current?.open()}
        >
          Create Post
        </Button>
      </>
    )
  else
    content = (
      <>
        <Anchor
          component={Link}
          href={callbackUrl('/register')}
          size='sm'
          fw={500}
          variant='link'
        >
          Register
        </Anchor>
        <Anchor
          component={Link}
          href={callbackUrl('/login')}
          size='sm'
          fw={500}
          variant='link'
        >
          Login
        </Anchor>
      </>
    )

  return (
    <>
      <Header
        pos='sticky'
        top={0}
        height={60}
        zIndex={1}
        withBorder={colorScheme === 'light'}
      >
        <Container h='100%' size='lg'>
          <Flex h='100%' align='center' justify='space-between'>
            <Text fw={500}>Logo</Text>
            <Flex align='center' gap='lg'>
              <Anchor
                component={Link}
                href='/'
                size='sm'
                fw={500}
                variant='link'
              >
                Home
              </Anchor>
              {content}
              <ActionIcon
                onClick={() => toggleColorScheme()}
                size='lg'
                radius='md'
                variant='default'
              >
                {themeIcon}
              </ActionIcon>
            </Flex>
          </Flex>
        </Container>
      </Header>
      {data?.me && <CreatePostModal ref={modalRef} />}
    </>
  )
}

export default memo(NavBar)
