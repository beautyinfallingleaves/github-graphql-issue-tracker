import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Box, Paper, Typography, Button, Link, Avatar} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
require('dotenv').config()

// *******
// styling
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  },
  searchCard: {
    minHeight: '15%',
    minWidth: '70%',
    margin: '15%',
    padding: '5px',
  },
  formControls: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  organizationInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  organizationDetails: {
    marginLeft: '8px',
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  }
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
  query getIssuesOfRepository ($organization: String!, $repository: String!) {
  organization(login: $organization) {
    name
    url
    avatarUrl
    description
    repository(name: $repository) {
      name
      url
      issues(last: 5, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            reactions(last: 3) {
              edges {
                node {
                  id
                  content
                }
              }
            }
          }
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
  function fetchFromGitHub(path) {
    getIssuesOfRepository(path).then(queryResult => {
      setOrganization(queryResult.data.data.organization)
      setErrors(queryResult.data.errors)
    })
  }

  function getIssuesOfRepository(path) {
    const [organization, repository] = path.split('/')

    return axiosGitHubGraphQL.post('', {
      query: GET_ISSUES_OF_REPOSITORY_QUERY,
      variables: { organization, repository }
    })
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
            <Organization organization={organization} />
          ) : (
            <Typography variant="body1">No Organization yet.</Typography>
          )
        }
      </Paper>
    </Box>
  )
}

const Organization = ({organization, errors}) => {
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
      <Typography variant="h6">Issues from Organization:</Typography>
      <Box className={classes.organizationInfo}>
        <Avatar className={classes.small} src={organization.avatarUrl}/>
        <Link className={classes.organizationDetails} href={organization.url}>{organization.name}</Link>
        <Typography className={classes.organizationDetails} variant="body1">"{organization.description}"</Typography>
      </Box>
      <Repository repository={organization.repository} />
    </Box>
  )
}

const Repository = ({repository}) => (
  <Box>
    <Typography variant="h6">In Repository:</Typography>
    <Link href={repository.url}>{repository.name}</Link>
    <ul>
      {repository.issues.edges.map(issue => (
        <li key={issue.node.id}>
          <Link href={issue.node.url}>{issue.node.title}</Link>

          <ul>
            {issue.node.reactions.edges.map(reaction => (
              <li key={reaction.node.id}>{reaction.node.content}</li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </Box>
)
