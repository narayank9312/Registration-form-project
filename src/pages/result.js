import React from 'react';
import {gql, useMutation, useQuery, useSubscription} from '@apollo/client';

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
import {blue} from '@material-ui/core/colors';

require('@tensorflow/tfjs-backend-cpu');
require('@tensorflow/tfjs-backend-webgl');
const cocoSsd = require('@tensorflow-models/coco-ssd');

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const newUserRegistration = gql`
  subscription {
    newUserRegistration {
      first_name
      last_name
      id
      createdAt
      email
    }
  }
`;

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
  const subscription = useSubscription(newUserRegistration);
  const videoRef = React.useRef();
  const canvasRef = React.useRef();
  const canvasVideoRef = React.useRef();
  const ctxRef = React.useRef();
  const objectDetectionModel = React.useRef();

  React.useEffect(() => {
    cocoSsd.load().then((model) => {
      objectDetectionModel.current = model;
    });
  }, []);

  React.useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      videoRef.current.addEventListener('waiting', () => {
        clearInterval(canvasVideoRef.current);
      });
      videoRef.current.addEventListener('pause', (event) => {
        clearInterval(canvasVideoRef.current);
      });
      videoRef.current.addEventListener('play', () => {
        (function loop() {
          console.log('i am still here');
          if (!ctxRef.current) {
            ctxRef.current = canvasRef.current.getContext('2d'); // ctx so that we can use it to make a square around objects
          }
          ctxRef.current.drawImage(videoRef.current, 0, 0);

          objectDetectionModel.current
            ?.detect(videoRef.current)
            .then((predection) => {
              predection.forEach((val) => {
                if (!videoRef.current.paused && !videoRef.current.ended) {
                  ctxRef.current.beginPath();
                  ctxRef.current.rect(...val.bbox);
                  ctxRef.current.stroke();
                }
              });
            });
          canvasVideoRef.current = setInterval(loop, 1000 / 30);
        })();
      });
    }
  }, [videoRef.current]);

  React.useEffect(() => {
    console.log('i am here');
    console.log(subscription.data);
    if (subscription.data) {
      setRegisteredUsers((users) => [
        ...users,
        subscription.data.newUserRegistration,
      ]);
    }
  }, [subscription.data]);

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
      <>
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
                            return users.filter(
                              (user) => !selectedUser[user.id]
                            );
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
                        setSelectedUsers((val) => ({
                          ...val,
                          [row.id]: checked,
                        }));
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
        <div style={{width: '100%', height: '100%', marginTop: 30}}>
          <video
            ref={videoRef}
            src="/videos/final_page.mp4"
            style={{width: '100%', height: '100%'}}
            autoPlay
            controls
          ></video>
          <canvas id="canvas" ref={canvasRef}></canvas>
        </div>
      </>
    </ThemeProvider>
  );
}
