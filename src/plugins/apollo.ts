import {
  ApolloClient,
  ApolloLink,
  from,
  fromPromise,
  InMemoryCache,
  split
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable/dist'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { App } from 'vue'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from 'apollo-link-error'

import { getToken, setToken, deleteToken } from '../services/token.service'
import MemberRefreshToken from '../graphql/member/queries/RefreshToken.gql'
import { MemberRefreshTokenOutput } from '../types/graphql/member/MemberRefreshToken'

import router from '../router'

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      return {
        headers: {
          authorization: `Bearer ${getToken()}`
        }
      }
    }
  }
})

const httpLink = createUploadLink({
  uri: process.env.VUE_APP_API,
  headers: {
    authorization: `Bearer ${getToken()}`
  },
  credentials: 'include',
  fetch: (input, init) => {
    if (init) {
      init.headers = {
        ...init.headers,
        authorization: `Bearer ${getToken()}`
      }
    }
    return fetch(input, init)
  }
})

const getNewToken = async () => {
  return client.query<MemberRefreshTokenOutput>({
    query: MemberRefreshToken,
    fetchPolicy: 'network-only'
  })
}

const errorHandler = onError(
  ({ networkError, graphQLErrors, operation, forward }): any => {
    if (graphQLErrors) {
      const tokenError = graphQLErrors.find(x => x.message === 'Unauthorized')
      if (tokenError) {
        return fromPromise(
          getNewToken()
            .then(({ data }) => {
              if (!data.memberRefreshToken.result) {
                throw new Error(data.memberRefreshToken.message)
              }
              // Store the new tokens for your auth link
              setToken(data.memberRefreshToken.newToken)
              return data.memberRefreshToken.newToken
            })
            .catch(error => {
              // Handle token refresh errors e.g clear stored tokens, redirect to login, ...
              deleteToken()
              router.push('/')
            })
        )
          .filter(value => Boolean(value))
          .flatMap((): any => {
            const oldHeaders = operation.getContext().headers
            // modify the operation context with a new token
            operation.setContext({
              headers: {
                ...oldHeaders,
                authorization: `Bearer ${getToken()}`
              }
            })

            return forward(operation)
          })
      }
    }
  }
)

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink
)

const client = new ApolloClient({
  link: from([errorHandler as any, link]),
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${getToken()}`
  },
  credentials: 'include'
})

export default (app: App): void => {
  app.provide(DefaultApolloClient, client)
}
