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
    data: userList(page: $page, filter: $filter) {
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
      file {
        id
        recordId
        fileExt
        fileName
        filePath
        fileFullPath
      }
      updatedAt
      createdAt
      remark
    }
  }
`

export const readCount = gql`
  query readCount($filter: UserFilter) {
    page: userCount(filter: $filter) {
      total
    }
  }
`

export const createUser = gql`
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
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
      file {
        id
        fileFullPath
      }
      updatedAt
      createdAt
      remark
    }
  }
`

export const updateUser = gql`
  mutation updateUser($input: UpdateUserInput!, $id: ID!) {
    updateUser(input: $input, id: $id) {
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
      file {
        id
        fileFullPath
      }
      updatedAt
      createdAt
      remark
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
