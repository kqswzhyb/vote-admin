import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    user(id: $id) {
      id
      username
      createdAt
    }
  }
`

export const readAll = gql`
  query readAll($page: PageInput!, $filter: UserFilter) {
    userList(page: $page, filter: $filter) {
      id
      username
      nickname
      qqLevel
      qqVip
      lastLoginTime
      lastVoteTime
      role {
        id
        name
      }
      updatedAt
      createdAt
    }
  }
`

export const readCount = gql`
  query readCount($filter: UserFilter) {
    userCount(filter: $filter) {
      total
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
