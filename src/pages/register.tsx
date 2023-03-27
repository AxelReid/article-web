import type { NextPage } from 'next'
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
import { isEmail, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import { useRouter } from 'next/router'
import Link from 'next/link'
import NavBar from '../components/NavBar'
import { useRegisterMutation, UserRegisterInput } from '~/graphql'
import withApollo from '~/utils/withApollo'
import setToken from '~/utils/setToken'

const Register: NextPage = () => {
  const router = useRouter()
  const [mutate, { loading }] = useRegisterMutation()

  const form = useForm<UserRegisterInput>({
    initialValues: {
      username: '',
      password: '',
      email: '',
    },
    validate: {
      email: isEmail('Enter a valid email'),
    },
  })

  const register = async (vals: UserRegisterInput) => {
    try {
      const res = await mutate({
        variables: {
          userRegisterInput: vals,
        },
        // update: (cache, { data }) => {
        //   cache.writeQuery<MeQuery>({
        //     query: MeDocument,
        //     data: {
        //       __typename: 'Query',
        //       me: data?.register.user,
        //     },
        //   })
        // },
      })
      const errors = res.data?.register.errors
      if (errors) {
        for (let err of errors) {
          form.setFieldError(err.field, err.message)
        }
      } else {
        const data = res.data?.register
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
        location.replace(callBackUrl || '/')
      }
    } catch (error) {
      showNotification({
        color: 'red',
        title: 'Something went wrong. Try again!',
        message: '',
      })
    }
  }

  return (
    <>
      <NavBar />
      <Container size='lg'>
        <Box mt='xl' maw={280}>
          <Text>Sign up</Text>
          <form onSubmit={form.onSubmit(register)}>
            <Stack spacing='sm'>
              <TextInput label='Username' {...form.getInputProps('username')} />
              <TextInput label='Email' {...form.getInputProps('email')} />
              <PasswordInput
                label='Password'
                {...form.getInputProps('password')}
              />
              <Button loading={loading} type='submit'>
                Continue
              </Button>
            </Stack>
          </form>
          <Box fz='sm' mt={5}>
            <Text span>Have an account?</Text>{' '}
            <Anchor span component={Link} href='/login'>
              Login
            </Anchor>
          </Box>
        </Box>
      </Container>
    </>
  )
}

export default withApollo()(Register as any)
