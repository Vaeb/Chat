import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import HomePage from './HomePage';
import NavBar from './HeaderComponent/NavBar';

class App extends Component {
    render() {
        return (
            <div>
                <p>qq</p>
                <LeftPanel />
            </div>
        )
    }
}

export default App;