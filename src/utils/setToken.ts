import { setCookie } from 'cookies-next'

const setToken = (token: string) => {
  setCookie('token', token, {
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
  })
}

export default setToken
