import {makeStyles} from '@material-ui/core/styles'

export const useStyles = makeStyles(theme => ({
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
    display: 'flex',
    justifyContent: 'flex-start',
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
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  issueGridItem: {
    padding: '0.7%',
    overflow: 'auto',
  },
  issueHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}))
