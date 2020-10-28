import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    fontFamily: 'Bahnschrift Regular'
  },
  headTitle: {
    textAlign: 'center',
    fontSize: '28px',
    marginTop: 30,
  },
  actions: {
    width: '50%',
    display: 'block',
    margin: '0 auto',
    textAlign: 'center'
  },
  actionButton: {
    background: '#388CF8',
    width: 200,
    height: 50,
    borderRadius: '10px',
    textDecoration: 'none',
    margin: 'auto',
    fontFamily: 'Bahnschrift Regular',
    fontWeight: 'bold',
    fontSize: '20px',
    marginBottom: 20,
    boxShadow: '0px 2px 7px -2px rgba(0,0,0,0.75)'
  },
  accounts: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 30,
    borderBottom: '1px solid #707070'
  },
  accountsType: {

  },
  accountBalance: {

  },
}))

export default useStyles;