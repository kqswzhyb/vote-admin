import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    role(id: $id) {
      id
      name
      createdAt
    }
  }
`

export const readAll = gql`
  query readAll($page: PageInput!, $filter: RoleFilter) {
    roleList(page: $page, filter: $filter) {
      id
      name
      updatedAt
      createdAt
    }
  }
`
