import React from 'react';
import {gql, useMutation, useQuery} from '@apollo/client';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  Checkbox,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import {blue} from '@material-ui/core/colors';
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const getAllRegisterdUsers = gql`
  query {
    getRegistration {
      first_name
      last_name
      email
      createdAt
      id
    }
  }
`;

const deleteRegisterdUsers = gql`
  mutation {
    removeAllUsers
  }
`;

const removeSelectedUsers = gql`
  mutation removeUser($ids: [Int]!) {
    removeUser(ids: $ids)
  }
`;

export default function ResultPage() {
  const {data, loading, error, refetch} = useQuery(getAllRegisterdUsers);
  const [registeredUsers, setRegisteredUsers] = React.useState([]);

  React.useEffect(() => {
    if (!loading && !error) {
      setRegisteredUsers(data.getRegistration);
    }
  }, [data, loading, error]);

  const classes = useStyles();
  const [allChecked, setAllChecked] = React.useState(false);
  const [selectedUser, setSelectedUsers] = React.useState({});
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [deleteUsers] = useMutation(deleteRegisterdUsers);
  const [deleteSelectedUsers] = useMutation(removeSelectedUsers);
  const theme = createMuiTheme({
    palette: {
      type: 'dark',
      primary: {
        main: blue[500],
      },
    },
    typography: {
      fontFamily: 'poppins',
    },
  });
  return loading ? (
    <h1>loading...</h1>
  ) : error ? (
    <Typography>There's Some Error</Typography>
  ) : (
    <ThemeProvider theme={theme}>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            {(allChecked ||
              Object.keys(selectedUser).filter((val) => selectedUser[val])
                .length > 0) && (
              <Button
                onClick={() => {
                  setIsDeleting(true);
                  if (allChecked && !isDeleting) {
                    deleteUsers()
                      .then(() => {
                        setRegisteredUsers([]);
                      })
                      .finally(() => {
                        setAllChecked(false);
                        setIsDeleting(false);
                      });
                  } else if (!isDeleting) {
                    deleteSelectedUsers({
                      variables: {
                        ids: Object.keys(selectedUser)
                          .filter((val) => selectedUser[val])
                          .map((val) => parseInt(val)),
                      },
                    })
                      .then(() => {
                        setRegisteredUsers((users) => {
                          return users.filter((user) => !selectedUser[user.id]);
                        });
                      })
                      .finally(() => {
                        setIsDeleting(false);
                        setSelectedUsers({});
                      });
                  }
                }}
              >
                {isDeleting ? (
                  <CircularProgress style={{height: 30, width: 30}} />
                ) : (
                  'Delete'
                )}
              </Button>
            )}
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={allChecked}
                  onChange={(e, checked) => setAllChecked(checked)}
                  color="primary"
                  disabled={registeredUsers.length < 1}
                />
              </TableCell>
              <TableCell>Id</TableCell>
              <TableCell align="left">First_Name</TableCell>
              <TableCell align="left">Last_Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Registered At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registeredUsers.map((row, i) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  <Checkbox
                    checked={allChecked || selectedUser[row.id]}
                    onChange={(e, checked) => {
                      setSelectedUsers((val) => ({...val, [row.id]: checked}));
                    }}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  {i + 1}
                  {/* {row.id} */}
                </TableCell>
                <TableCell align="left">{row.first_name}</TableCell>
                <TableCell align="left">{row.last_name}</TableCell>
                <TableCell align="left">{row.email}</TableCell>
                <TableCell align="left">
                  {new Date(parseFloat(row.createdAt))
                    .toUTCString()
                    .replace('GMT', '')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
