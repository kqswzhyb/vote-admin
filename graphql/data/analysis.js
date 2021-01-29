import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: DataAnalysisTypeFilter) {
    data: dataAnalysisTypeList(page: $page, filter: $filter) {
      id
      name
      value
      remark
    }
  }
`

export const readCount = gql`
  query readCount($filter: DataAnalysisTypeFilter) {
    page: dataAnalysisTypeCount(filter: $filter) {
      total
    }
  }
`

export const createDataAnalysisType = gql`
  mutation createDataAnalysisType($input: CreateDataAnalysisTypeInput!) {
    createDataAnalysisType(input: $input) {
      id
      name
      value
      updatedAt
      createdAt
      remark
    }
  }
`

export const updateDataAnalysisType = gql`
  mutation updateDataAnalysisType($input: UpdateDataAnalysisTypeInput!, $id: ID!) {
    updateDataAnalysisType(input: $input, id: $id) {
      id
      name
      value
      updatedAt
      createdAt
      remark
    }
  }
`

export const deleteDataAnalysisType = gql`
  mutation deleteDataAnalysisType($id: ID!) {
    deleteDataAnalysisType(id: $id) {
      value
      message
    }
  }
`