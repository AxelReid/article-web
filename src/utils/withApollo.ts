import { withApollo } from 'next-apollo'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { PaginatedPosts } from '~/graphql'
import { NextPageContext } from 'next'

const createClient = (ctx?: NextPageContext) =>
  new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL as string,
    credentials: 'include',
    headers: {
      cookie:
        (typeof window === 'undefined'
          ? ctx?.req?.headers.cookie
          : undefined) || '',
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: false,
              merge: (
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts => ({
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              }),
            },
          },
        },
      },
    }),
  })

export default withApollo(createClient)
