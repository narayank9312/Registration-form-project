import BasicForm from './components/BasicForm';
import ResultPage from './pages/result';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
// import SimpleInput from './components/SimpleInput';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Switch>
          <Route path="/register" exact={true} component={BasicForm} />
          <Route path="/home" exact={true} component={ResultPage} />
          <Redirect to="/register" />
        </Switch>
      </BrowserRouter>
      {/* <SimpleInput /> */}
    </div>
  );
}

export default App;
