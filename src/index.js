import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App'
import { Route, HashRouter} from 'react-router-dom';
import Survey from './Survey/Survey'
import Questions from './Survey/Questions'
import Results from './Survey/Results'
import CreateSurvey from './Survey/CreateSurvey'
import Maintenance from './Survey/Maintenance'
// import * as serviceWorker from './serviceWorker';


const Root = () => {
	return (
        <HashRouter>
            <div>
                <Route exact path="/" component={App} />
                <Route path="/survey" component={Survey} />
                <Route path="/questions" component={Questions} />
                <Route path="/results" component={Results} />
                <Route path="/createsurvey" component={CreateSurvey} />
                <Route path="/maintenance" component={Maintenance} />
            </div>
        </HashRouter>
	)
}

ReactDOM.render(
    <Root />, document.getElementById('root')
);
