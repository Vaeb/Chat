import React, { Component } from 'react';

class HomePage extends Component {
    render() {
        return (
            <div class="HomePage">
                This is the HomePage Route, which will be loaded when the user accesses the home page.
                <br />
                The side bar to the left exists across pages, and as such it is separate to the existence of the HomePage route.
            </div>
        )
    }
}

export default HomePage;