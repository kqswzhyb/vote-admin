import gql from 'graphql-tag'

export const readAll = gql`
  query readAll($page: PageInput!, $filter: VoteFilter) {
    data: voteList(page: $page, filter: $filter) {
      id
      voteName
      voteType
      voteConfigId
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
