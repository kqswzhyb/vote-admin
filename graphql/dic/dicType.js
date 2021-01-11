import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: DicTypeFilter) {
    data: dicTypeList(page: $page, filter: $filter) {
      id
      name
      code
      remark
      dic {
        id
        name
        value
        remark
      }
    }
  }
`

export const readCount = gql`
  query readCount($filter: DicTypeFilter) {
    page: dicTypeCount(filter: $filter) {
      total
    }
  }
`

export const createDicType = gql`
  mutation createDicType($input: CreateDicTypeInput!) {
    createDicType(input: $input) {
      id
      name
      code
      updatedAt
      createdAt
      remark
    }
  }
`

export const updateDicType = gql`
  mutation updateDicType($input: UpdateDicTypeInput!, $id: ID!) {
    updateDicType(input: $input, id: $id) {
      id
      name
      code
      updatedAt
      createdAt
      remark
    }
  }
`

export const deleteDicType = gql`
  mutation deleteDicType($id: ID!) {
    deleteDicType(id: $id) {
      code
      message
    }
  }
`
