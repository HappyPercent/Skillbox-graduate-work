import React from 'react';

import { authenticationUrl } from '../unsplashAPI';

class Home extends React.Component {

    goToAuthorizationPage() {
        location.assign(authenticationUrl);
    }

    render() {
        return (
            <div className='home'>
                <h1>Welcome, please, <span onClick={ this.goToAuthorizationPage } className='authorization_button'><span>authorize</span></span> via Unsplash.com</h1>
            </div>
        )
    }
}; 

export default Home;