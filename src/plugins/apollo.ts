import { ApolloClient, InMemoryCache } from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable/dist'
import { createUploadLink } from 'apollo-upload-client'
import { App } from 'vue'
import { getToken } from '../services/token.service'

const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.VUE_APP_API,
    headers: {
      authorization: `Bearer ${getToken()}`
    }
  }),
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${getToken()}`
  }
})

export default (app:App):void => {
  app.provide(DefaultApolloClient, client)
}
