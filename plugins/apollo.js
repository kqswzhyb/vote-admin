import VueApollo from 'vue-apollo'
import Vue from 'vue'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { ApolloLink, from, concat } from 'apollo-link'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import { Message } from 'element-ui'
import fetch from 'node-fetch'

const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  uri: 'http://localhost:7001/api/graphql',
  fetch,
})

Vue.use(VueApollo)

export default function ({ app}) {
// =======
// Apollo Client
// =======
const authMiddleware = new ApolloLink((operation, forward) => {
  const token = app.$cookies.get('token')

  operation.setContext({
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return forward(operation)
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ extensions }) => {
      console.log(
        `[GraphQL error]: ${extensions.exception.stacktrace.map(v=>v+'\n').toString()}`
      )
      Message.error('输入内容错误，请重试！')
    })
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
    Message.error('网络不可用，请重试！')
  }
})

// 缓存实现
const cache = new InMemoryCache()

// 创建 apollo 客户端
const apolloClient = new ApolloClient({
  link: concat(errorLink, from([authMiddleware, httpLink])),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    }
  }
})

// Generate global ApolloClient
// globalThis.ApolloClient = apolloClient

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $query: {
      fetchPolicy: 'network-only'
    }
  }
})
Vue.prototype.$query= (query,variables=null)=>{
  return apolloProvider.defaultClient
  .query({
    fetchPolicy: 'network-only',
    fetchResults: true,
    query,
    variables,
  })
}
Vue.prototype.$mutate= (mutation,variables=null)=>{
  return apolloProvider.defaultClient
  .mutate({
    fetchPolicy: 'no-cache',
    fetchResults: true,
    mutation,
    variables,
  })
}
// Assign apollo client to Vue
Vue.prototype.$apolloProvider = apolloProvider
}




