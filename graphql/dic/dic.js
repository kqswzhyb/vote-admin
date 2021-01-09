import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!) {
    data: dicTypeList(page: $page) {
      id
      name
      code
      dic {
        id
        name
        value
      }
    }
  }
`
