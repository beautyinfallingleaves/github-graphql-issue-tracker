import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Box, Paper, Typography, Button, Link, Avatar, Grid} from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import {makeStyles} from '@material-ui/core/styles'
import {mapGHReactionToEmoji} from './util'
require('dotenv').config()

// *******
// styling
const useStyles = makeStyles(theme => ({
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    padding: '1rem',
  },
  searchCard: {
    padding: 10,
  },
  formControls: {
    width: 700,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  organizationInfo: {
    width: 335,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  organizationDetails: {
    marginLeft: 8,
    fontStyle: 'italic',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  repositoryInfo: {
    width: 345,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueGridItem: {
    height: 300,
    width: 225,
    padding: '2%',
    overflow: 'auto',
  },
}))

const TITLE = 'Search GitHub Issues by Repository (via GraphQL)'

// *****
// Create axios instance
const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
})

const GET_ISSUES_OF_REPOSITORY_QUERY = `
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
      viewerHasStarred
      issues(first: 5, after: $endCursor, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            body
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


export default function App(props) {
  const classes = useStyles()

  const [path, setPath] = useState('facebook/create-react-app')
  function handleChange(event) {
    setPath(event.target.value)
  }

  useEffect(() => {
    //fetch data
    fetchFromGitHub(path)
  }, [])

  function handleSubmit(event) {
    //fetch data
    fetchFromGitHub(path)
    event.preventDefault()
  }

  const [organization, setOrganization] = useState(null)
  const [errors, setErrors] = useState(null)
  function fetchFromGitHub(path, endCursor) {
    getIssuesOfRepository(path, endCursor).then(queryResult => {
      const {data, errors} = queryResult.data

      // if no endCursor provided, directly set state of organization and errors
      if (!endCursor) {
        setOrganization(data.organization)
        setErrors(errors)
      } else {
        // if endCursor is provided, merge old issues with new issues
        const {edges: oldIssues} = organization.repository.issues
        const {edges: newIssues} = data.organization.repository.issues
        const updatedIssues = [...oldIssues, ...newIssues]

        const updatedOrganization = {
          ...data.organization,
          repository: {
            ...data.organization.repository,
            issues: {
              ...data.organization.repository.issues,
              edges: updatedIssues,
            }
          }
        }

        console.log('organization:', organization)
        console.log('updated organization: ', updatedOrganization)

        setOrganization(updatedOrganization)
        setErrors(errors)
      }

    })
  }

  function getIssuesOfRepository(path, endCursor) {
    const [organization, repository] = path.split('/')

    return axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY_QUERY,
      variables: { organization, repository, endCursor }
    })
  }

  function fetchMoreIssues() {
    const {endCursor} = organization.repository.issues.pageInfo
    fetchFromGitHub(path, endCursor)
  }

  function starRepository(id, viewerHasStarred) {
    console.log('starrrrrr', id, viewerHasStarred)
  }

  return (
    <Box className={classes.root}>
      <Paper className={classes.searchCard} elevation={5}>
        <Typography variant="h5" color="primary">{TITLE}</Typography>

        <form onSubmit={handleSubmit}>
          <Box className={classes.formControls}>
            <Box>
              <label htmlFor="url">
                Show open issues for https://github.com/
              </label>
              <input
                id="url"
                type="text"
                value={path}
                onChange={handleChange}
                style={{width: '300px'}}
                placeholder="organization-name/repository-name"
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" size="small">Search</Button>
          </Box>
        </form>
        <hr/>
        {organization ? (
            <Organization organization={organization} fetchMoreIssues={fetchMoreIssues} starRepository={starRepository} />
          ) : (
            <Typography variant="body1">No Organization yet.</Typography>
          )
        }
      </Paper>
    </Box>
  )
}

const Organization = ({organization, errors, fetchMoreIssues, starRepository}) => {
  const classes = useStyles()
  if (errors) {
    return (
      <Box>
        <Typography variant="h6">Something went wrong:</Typography>
        {errors.map(error => error.message).join()}
      </Box>
    )
  }

  return (
    <Box>
      <Box className={classes.organizationInfo}>
        <Typography variant="h6">Issues from Organization:</Typography>
        <Avatar className={classes.small} src={organization.avatarUrl}/>
        <Link href={organization.url}>{organization.name}</Link>
      </Box>
      <Typography className={classes.organizationDetails} variant="body1">"{organization.description}"</Typography>
      <Repository
        repository={organization.repository}
        fetchMoreIssues={fetchMoreIssues}
        starRepository={starRepository}
      />
    </Box>
  )
}

const Repository = ({repository, fetchMoreIssues, starRepository}) => {
  const classes = useStyles()

  return (
    <Box>
      <Box className={classes.repositoryInfo}>
        <Typography variant="h6">In Repository:</Typography>
        <Link href={repository.url}>{repository.name}</Link>
        <Typography variant="caption">(total: {repository.issues.totalCount})</Typography>
        {repository.viewerHasStarred ? (
          <StarIcon fontSize="small" onClick={() => starRepository(repository.id, repository.viewerHasStarred)} />
        ) : (
          <StarBorderIcon fontSize="small" onClick={() => starRepository(repository.id, repository.viewerHasStarred)} />
        )}
      </Box>

      <Grid container spacing={2} justify="flex-start">
        {repository.issues.edges.map(issue => (
          <Grid key={issue.node.id} item>
            <Paper className={classes.issueGridItem} elevation={3}>
              <Link href={issue.node.url}>{issue.node.title}</Link>
              <hr/>
              {issue.node.reactions.edges.map(reaction => (
                <Typography variant="caption" key={reaction.node.id}>{mapGHReactionToEmoji(reaction.node.content)}</Typography>
              ))}
              <hr/>
              <Typography variant="caption">{issue.node.body}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <hr/>
      {repository.issues.pageInfo.hasNextPage && (
        <Button onClick={fetchMoreIssues} type="button" variant="contained" color="primary" size="small">Show More</Button>
      )}
    </Box>
  )
}
