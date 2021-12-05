import {BrowserRouter as Router , Route} from 'react-router-dom';
import './App.css';
import Login from './Login';

function App() {
  return (
    <Router>
       <div className="App">
        <Login />
    </div>
  </Router>
  );
}

export default App;
