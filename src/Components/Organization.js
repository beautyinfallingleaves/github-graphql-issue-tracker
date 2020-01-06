import React from 'react';
import {Box, Typography, Link, Avatar} from '@material-ui/core'
import {useStyles} from '../util'
import {Repository} from './'

export const Organization = ({organization, errors, fetchMoreIssues, starRepository}) => {
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
