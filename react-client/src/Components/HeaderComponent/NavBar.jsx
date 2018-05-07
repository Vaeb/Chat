import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavBar extends Component {
    render() {
        return (
            <ul id="navButtons">
                <li className="navButton">
                    <Link to="">Home</Link>
                </li>
            </ul>
        )
    }
}

export default NavBar;