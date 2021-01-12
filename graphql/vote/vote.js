import gql from 'graphql-tag'

export const readOne = gql`
  query readOne($id: ID!) {
    data: vote(id: $id) {
      id
      voteName
      voteType
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
  query readAll($page: PageInput!, $filter: VoteFilter) {
    data: voteList(page: $page, filter: $filter) {
      id
      voteName
      voteType
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
      }
    }
  }
`

export const readCount = gql`
  query readCount($filter: VoteFilter) {
    page: voteCount(filter: $filter) {
      total
    }
  }
`

export const createVote = gql`
  mutation createVote($input: CreateVoteInput!) {
    createVote(input: $input) {
      id
      voteName
      voteType
      updatedAt
      createdAt
      remark
    }
  }
`
export const updateVote = gql`
  mutation updateVote($input: UpdateVoteInput!, $id: ID!) {
    updateVote(input: $input, id: $id) {
      id
      voteName
      voteType
      updatedAt
      createdAt
      remark
    }
  }
`
