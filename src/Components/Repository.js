import React from 'react';
import {Box, Typography, Link, Grid, Paper, Button} from '@material-ui/core'
import StarIcon from '@material-ui/icons/Star'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import {
  mapGHReactionToEmoji,
  useStyles
} from '../util'

export const Repository = ({repository, fetchMoreIssues, starRepository}) => {
  const classes = useStyles()

  return (
    <Box>
      <Box className={classes.repositoryInfo}>
        <Typography variant="h6">In Repository:</Typography>
        <Link href={repository.url}>{repository.name}</Link>
        <Typography variant="caption">(total issues: {repository.issues.totalCount})</Typography>
        {repository.viewerHasStarred ? (
          <StarIcon fontSize="small" onClick={() => starRepository(repository.id, repository.viewerHasStarred)} />
        ) : (
          <StarBorderIcon fontSize="small" onClick={() => starRepository(repository.id, repository.viewerHasStarred)} />
        )}
        <Typography variant="caption">({repository.stargazers.totalCount} users have starred this repository)</Typography>
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
