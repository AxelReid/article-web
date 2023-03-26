import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useMeQuery } from '~/graphql'

const useIsAuth = () => {
  const { loading, data } = useMeQuery()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace('/login')
    }
  }, [loading, data, router])

  // if (loading) return 'Loading...'
}

export default useIsAuth
