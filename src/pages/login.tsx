import {
  Anchor,
  Box,
  Button,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import type { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import ForgotPassModal from '~/components/Modal/ForgotPassModal'
import { useLoginMutation, UserLoginInput } from '~/graphql'
import { ModalMutableRefProps } from '~/types/modalRef'
import setToken from '~/utils/setToken'
import withApollo from '~/utils/withApollo'
import NavBar from '../components/NavBar'

const Login: NextPage = () => {
  const router = useRouter()
  const modalRef: ModalMutableRefProps<string> = useRef(null)
  const [mutate, { loading }] = useLoginMutation()

  const form = useForm<UserLoginInput>({
    initialValues: {
      password: '',
      usernameOrEmail: '',
    },
  })

  const login = async (vals: UserLoginInput) => {
    try {
      const res = await mutate({
        variables: {
          userLoginInput: vals,
        },
        // update: (cache, { data }) => {
        //   cache.writeQuery<MeQuery>({
        //     query: MeDocument,
        //     data: {
        //       __typename: 'Query',
        //       me: data?.login.user,
        //     },
        //   })
        //   cache.evict({ fieldName: 'posts' })
        // },
      })
      const errors = res.data?.login.errors
      if (errors) {
        for (let err of errors) {
          form.setFieldError(err.field, err.message)
        }
      } else {
        const data = res.data?.login
        setToken(data?.token as string)
        showNotification({
          color: 'green',
          title: 'Welcome back, ' + data?.user?.username,
          withCloseButton: false,
          autoClose: 1500,
          message: '',
        })
        const callBackUrl = router.query?.callbackUrl as string
        // router.push(callBackUrl || '/')
        window.location.replace(callBackUrl || '/')
      }
    } catch (error: any) {
      showNotification({
        color: 'red',
        title: error?.message || 'Something went wrong. Try again!',
        message: '',
      })
    }
  }

  return (
    <>
      <NavBar />
      <Container size='lg'>
        <Box mt='xl' maw={280}>
          <Text>Login</Text>
          <form onSubmit={form.onSubmit(login)}>
            <Stack spacing='sm'>
              <TextInput
                label='Username/Email'
                {...form.getInputProps('usernameOrEmail')}
              />
              <PasswordInput
                label='Password'
                {...form.getInputProps('password')}
              />
              <Button loading={loading} type='submit'>
                Login
              </Button>
            </Stack>
          </form>
          <Box fz='sm' mt={5}>
            <Text span>Don{"'"}t have an account?</Text>{' '}
            <Anchor span component={Link} href='/register'>
              Register
            </Anchor>
          </Box>
          {/* <Box fz='sm'>
            <Text span>Forgot password?</Text>{' '}
            <Anchor
              onClick={() =>
                modalRef.current?.open(form.values.usernameOrEmail)
              }
            >
              Reset
            </Anchor>
          </Box> */}
        </Box>
      </Container>
      <ForgotPassModal ref={modalRef} />
    </>
  )
}

export default withApollo()(Login as any)
