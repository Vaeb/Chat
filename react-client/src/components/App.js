import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './pages/HomePage.js';
import NavBar from './navBar/NavBar.js';
import LeftPanel from './leftPanel/LeftPanel.js';

class App extends Component {
    render() {
        return (
            <Router>
                <div>
                    <LeftPanel />
                    <Route name="home" exact path="/" component={HomePage} />
                </div>
            </Router>
        )
    }
}

export default App;