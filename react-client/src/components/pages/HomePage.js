import React, { Component } from 'react';

class HomePage extends Component {
    render() {
        return (
            <div>
                This is the HomePage Route, which will be loaded when the user accesses the home page. The side bar to the left exists across pages, and as such it is separate to the existence of the HomePage route.
            </div>
        )
    }
}

export default HomePage;