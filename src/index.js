import ReactDOM from 'react-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import './index.css';
import App from './App';
import 'typeface-poppins';
// const gqlEndpoint = `http://localhost:3000/graphql`;
const gqlEndpoint = `http://18.198.207.183:3000/`;

const apolloClient = new ApolloClient({
  uri: gqlEndpoint,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
