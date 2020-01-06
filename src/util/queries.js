export const GET_ISSUES_OF_REPOSITORY_QUERY = `
  query getIssuesOfRepository (
    $organization: String!,
    $repository: String!,
    $endCursor: String
  ) {
    organization(login: $organization) {
      name
      url
      avatarUrl
      description
      repository(name: $repository) {
        id
        name
        url
        stargazers {
          totalCount
        }
        viewerHasStarred
        issues(first: 5, after: $endCursor, states: [OPEN]) {
          edges {
            node {
              id
              title
              url
              body
              createdAt
              reactions(last: 8) {
                edges {
                  node {
                    id
                    content
                  }
                }
              }
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  }`

export const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input: {starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }`

export const REMOVE_STAR = `
  mutation ($repositoryId: ID!) {
    removeStar(input: {starrableId: $repositoryId}) {
      starrable {
        viewerHasStarred
      }
    }
  }`
