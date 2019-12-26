import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {Paper, Typography, Button, Link} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
require('dotenv').config()

// *******
// styling
const useStyles = makeStyles({
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
  }
})

const TITLE = 'GraphQL GitHub Client'
const GET_REPOSITORY_OF_ORGANIZATION = `{
  organization(login: "the-road-to-learn-react") {
    name
    url
    repository(name: "the-road-to-learn-react") {
      name
      url
    }
  }
}`

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

export default function App(props) {
  const classes = useStyles()

  const [path, setPath] = useState('the-road-to-learn-react')
  function handleChange(event) {
    setPath(event.target.value)
  }

  useEffect(() => {
    //fetch data
    onFetchFromGitHub()
  }, [path])

  function handleSubmit(event) {
    //fetch data
    event.preventDefault()
  }

  const [organization, setOrganization] = useState(null)
  const [errors, setErrors] = useState(null)
  function onFetchFromGitHub() {
    axiosGitHubGraphQL
      .post('', {query: GET_REPOSITORY_OF_ORGANIZATION})
      .then(result => {
        setOrganization(result.data.data.organization)
        setErrors(result.data.errors)
      })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.searchCard} elevation={5}>
        <Typography variant="h4" color="primary">{TITLE}</Typography>

        <form onSubmit={handleSubmit}>
          <label htmlFor="url">
            Show open issues for https://github.com/
          </label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={handleChange}
            style={{width: '300px'}}
            placeholder="enter repository name"
          />
          <Button type="submit" variant="contained" color="primary" size="small">Search</Button>
        </form>
        <hr/>
        {organization ? (
            <Organization organization={organization} />
          ) : (
            <Typography variant="body1">No Organization yet.</Typography>
          )
        }
      </Paper>
    </div>
  )
}

const Organization = ({organization, errors}) => {
  if (errors) {
    return (
      <div>
        <Typography variant="h6">Something went wrong:</Typography>
        {errors.map(error => error.message).join()}
      </div>
    )
  }

  return (
    <div>
      <Typography variant="h6">Issues from Organization:</Typography>
      <Link href={organization.url}>{organization.name}</Link>
    </div>
  )
}
