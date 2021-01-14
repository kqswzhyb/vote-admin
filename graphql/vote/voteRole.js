import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: vote(id: $id) {
      id
      voteName
      voteType
      specialType
      startTime
      endTime
      ruleContent
      hasReward
      rewardContent
      createBy
      status
      voteConfig {
        id
        showMap
        showChart
        voteShowType
        voteUpdateType
        diyBg
        hasSpecialVote
        voteQqVip
        voteLevel
        file {
          id
          recordId
          fileExt
          fileName
          filePath
          fileFullPath
        }
      }
      voteRoleType {
        id
        name
      }
    }
  }
`

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteRoleFilter) {
    data: voteRoleList(page: $page, filter: $filter) {
      id
      roleName
      alias
      description
      status
      file {
        id
        recordId
        fileExt
        fileName
        filePath
        fileFullPath
      }
      createBy
      remark
    }
  }
`

export const readCount = gql`
  query readCount($filter: VoteRoleFilter) {
    page: voteRoleCount(filter: $filter) {
      total
    }
  }
`

export const createVoteRole = gql`
  mutation createVote($input: CreateVoteRoleInput!) {
    createVoteRole(input: $input) {
      id
      roleName
      alias
      description
      status
      file {
        id
        recordId
        fileExt
        fileName
        filePath
        fileFullPath
      }
      remark
    }
  }
`
export const updateVoteRole = gql`
  mutation updateVoteRole($input: UpdateVoteRoleInput!, $id: ID!) {
    updateVoteRole(input: $input, id: $id) {
      id
      roleName
      alias
      description
      status
      file {
        id
        recordId
        fileExt
        fileName
        filePath
        fileFullPath
      }
      remark
    }
  }
`

export const deleteVoteRole = gql`
  mutation deleteVoteRole($id: ID!) {
    deleteVoteRole(id: $id) {
      code
      message
    }
  }
`