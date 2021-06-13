import BasicForm from './components/BasicForm';
import ResultPage from './pages/result';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route path="/register" exact={true} component={BasicForm} />
          <Route path="/result" exact={true} component={ResultPage} />
          <Redirect to="/register" />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
