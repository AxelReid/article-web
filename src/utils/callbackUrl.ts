import Router from 'next/router'

const excluded = ['/register', '/login']

export const callbackUrl = (where: string) => {
  const url = typeof window === 'undefined' ? '/' : Router.pathname
  if (url === '/' || url === where || excluded.includes(url)) return where
  return where + '?callbackUrl=' + url
}
