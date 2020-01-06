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
    width: 645,
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
