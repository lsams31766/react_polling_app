import React, { Component } from 'react';
import './App.css';
// import Person from './Person/Person'
import Survey from './Survey/Survey'
import Questions from './Survey/Questions'
import ReactDOM from 'react-dom';
import { Route, HashRouter} from 'react-router-dom';
import { Link } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      suvey_titles: [],
    }
  }

  // fetch the list of surveys from the backend
  componentDidMount() {
    fetch('http://127.0.0.1:5000/')
      .then(response => response.json())
      .then((survey_titles) => {
        this.setState({ survey_titles })
        //console.log(this.state)
      })
      console.log("App componentDidMount() state",this.state)
  }
  render() {
      // some css
      const style = {
          backgroundColor: 'white',
          font: 'inherit',
          border: '2px solid blue',
          padding: '8px',
          cursor: 'pointer'
      };

      return (
        <div className="App">
          <h1>This is the Polling App</h1>

          <div>
            <h1>Main Selection Screen</h1>
            <ul>
                <li>
                  <Link to={{
                    pathname: '/survey',
                    state: {
                      survey_titles: this.state.survey_titles
                    }
                  }}>Choose Survey</Link>
                </li>
                <li><Link to="/results">Results</Link></li>
              </ul>
          </div>
        </div>
      );
  }
}

export default App;
