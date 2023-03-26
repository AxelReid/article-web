import { Box, Stack, PasswordInput, Button, Text, Anchor } from '@mantine/core'
import { useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import ForgotPassModal from '~/components/Modal/ForgotPassModal'
import {
  ChangePasswordMutationVariables,
  MeDocument,
  MeQuery,
  useChangePasswordMutation,
} from '~/graphql'
import { ModalMutableRefProps } from '~/types/modalRef'
import { formatGqlErrorMsg } from '~/utils'
import withApollo from '~/utils/withApollo'

type FormType = Omit<ChangePasswordMutationVariables, 'token'>

const ChangePassword: NextPage = () => {
  const router = useRouter()
  const modalRef: ModalMutableRefProps = useRef(null)
  const token = String(router.query.token)
  const [mutate, { loading, error }] = useChangePasswordMutation()

  const form = useForm<FormType>({
    initialValues: {
      newPassword: '',
    },
  })

  const submit = async ({ newPassword }: FormType) => {
    try {
      const res = await mutate({
        variables: { newPassword, token },
        update: (cache, { data }) => {
          cache.writeQuery<MeQuery>({
            query: MeDocument,
            data: {
              __typename: 'Query',
              me: data?.changePassword.user,
            },
          })
        },
      })
      const errors = res.data?.changePassword.errors

      if (res.errors) {
        showNotification({
          color: 'red',
          title: formatGqlErrorMsg(res.errors[0].message),
          message: '',
        })
        return
      }
      if (errors) {
        for (let err of errors) {
          form.setFieldError(err.field, err.message)
        }
      } else {
        const user = res.data?.changePassword.user
        router.push('/')
        showNotification({
          color: 'green',
          title: 'Welcome back, ' + user?.username,
          disallowClose: true,
          autoClose: 1500,
          message: '',
        })
      }
    } catch (error: any) {
      showNotification({
        color: 'red',
        title: error?.message,
        message: '',
      })
    }
  }

  return (
    <>
      <div>Change password: {token}</div>
      <Box p='xl' maw={280}>
        <Text>Login</Text>
        <form onSubmit={form.onSubmit(submit)}>
          <Stack spacing='sm'>
            <PasswordInput
              label='New password'
              {...form.getInputProps('newPassword')}
            />
            <Button loading={loading} type='submit'>
              Change Password
            </Button>
          </Stack>
        </form>
        {error && (
          <Box mt={5}>
            <Anchor fz='sm' onClick={() => modalRef.current?.open()}>
              Forgot again?!
            </Anchor>
          </Box>
        )}
      </Box>
      <ForgotPassModal ref={modalRef} />
    </>
  )
}

export default withApollo()(ChangePassword as any)
