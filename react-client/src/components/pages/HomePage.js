import React, { Component } from 'react';

class HomePage extends Component {
    render() {
        return (
            <div class="HomePage">
                This is the HomePage Route, which will be loaded when home page is opened.
                <br />
                The side bar to the left exists across page-routes, and as such it is separate to the existence of the HomePage component.
            </div>
        )
    }
}

export default HomePage;