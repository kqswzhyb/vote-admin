import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: DicFilter) {
    data: dicList(page: $page, filter: $filter) {
      id
      name
      value
      remark
    }
  }
`

export const readCount = gql`
  query readCount($filter: DicFilter) {
    page: dicCount(filter: $filter) {
      total
    }
  }
`

export const createDic = gql`
  mutation createDic($input: CreateDicInput!) {
    createDic(input: $input) {
      id
      name
      value
      updatedAt
      createdAt
      remark
    }
  }
`

export const updateDic = gql`
  mutation updateDic($input: UpdateDicInput!, $id: ID!) {
    updateDic(input: $input, id: $id) {
      id
      name
      value
      updatedAt
      createdAt
      remark
    }
  }
`

export const deleteDic = gql`
  mutation deleteDic($id: ID!) {
    deleteDic(id: $id) {
      code
      message
    }
  }
`