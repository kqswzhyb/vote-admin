import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    user(id: $id) {
      id
      username
    }
  }
`

export const deleteUser = gql`
  mutation deleteUser($id: ID!) {
    deleteUser(id: $id) {
      code
      message
    }
  }
`
