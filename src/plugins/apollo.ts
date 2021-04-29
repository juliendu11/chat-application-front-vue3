import { ApolloClient, InMemoryCache, split } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable/dist'
import { createUploadLink } from 'apollo-upload-client'
import { WebSocketLink } from '@apollo/client/link/ws'
import { App } from 'vue'
import { getToken } from '../services/token.service'
import { getMainDefinition } from '@apollo/client/utilities'

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:3000/graphql',
  options: {
    reconnect: true,
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
  link,
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${getToken()}`
  },
  credentials: 'include'
})

export default (app:App):void => {
  app.provide(DefaultApolloClient, client)
}
