import React, {useState, useEffect} from 'react';
import {Box, Paper, Typography, Button} from '@material-ui/core'
import {
  useStyles,
  GET_ISSUES_OF_REPOSITORY_QUERY,
  ADD_STAR,
  REMOVE_STAR,
  TITLE
} from './util'
import {axiosGitHubGraphQL} from './'
import {Organization} from './Components'
require('dotenv').config()

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

  async function starRepository(repositoryId, viewerHasStarred) {
    const mutationResult = await axiosGitHubGraphQL.post('', {
      query: viewerHasStarred ? REMOVE_STAR : ADD_STAR,
      variables: {repositoryId}
    })

    const {data} = mutationResult.data
    const {totalCount} = organization.repository.stargazers

    const updatedOrganization = {
      ...organization,
      repository: {
        ...organization.repository,
        viewerHasStarred: data.addStar ? data.addStar.starrable.viewerHasStarred : data.removeStar.starrable.viewerHasStarred,
        stargazers: {
          totalCount: data.addStar ? totalCount + 1 : totalCount - 1
        }
      }
    }

    setOrganization(updatedOrganization)
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

