import { Anchor, Button, Flex, Text, TextInput } from '@mantine/core'
import { isEmail, useForm } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import {
  ForgotPasswordMutationVariables,
  useForgotPasswordMutation,
} from '~/graphql'

const Content = ({ email }: { email: string }) => {
  const [mutate, { loading, data }] = useForgotPasswordMutation()

  const form = useForm<ForgotPasswordMutationVariables>({
    initialValues: {
      email,
    },
    validate: { email: isEmail('Enter a valid email') },
  })
  const submit = async (vals: ForgotPasswordMutationVariables) => {
    const notify = () =>
      showNotification({
        color: 'red',
        title: "Couldn't send email. Try again!",
        message: '',
      })
    try {
      const res = await mutate({ variables: vals })
      const sent = res.data?.forgotPassword
      if (!sent) notify()
    } catch (error) {
      notify()
    }
  }

  return (
    <form onSubmit={form.onSubmit(submit)}>
      <TextInput
        label='Email'
        description='Enter an acount email to recieve a link to re-new password'
        {...form.getInputProps('email')}
        data-autofocus
      />
      {data?.forgotPassword && Object.values(form.errors).length < 1 && (
        <Text fz='sm' mt={5}>
          Email was sent. Didn{"'"}t get?{' '}
          <Anchor onClick={() => submit({ email: form.values.email })}>
            Resend
          </Anchor>
        </Text>
      )}
      <Flex gap='sm' justify='flex-end' mt='lg'>
        <Button type='submit' loading={loading}>
          Send email
        </Button>
      </Flex>
    </form>
  )
}

export default Content
