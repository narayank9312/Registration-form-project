import ReactDOM from 'react-dom';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import './index.css';
import App from './App';
import 'typeface-poppins';
import {splitLink} from './gql/link';
// const gqlEndpoint = `http://localhost:3000/graphql`;

const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
