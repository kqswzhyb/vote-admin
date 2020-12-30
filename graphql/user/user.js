import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    user(id: $id) {
      id
      username
    }
  }
`
