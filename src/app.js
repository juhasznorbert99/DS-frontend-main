import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import NavigationBar from './navigation-bar'
import Home from './home/home';
import PersonContainer from './person/person-container'
import UserContainer from "./user/user-container";
import SensorContainer from "./sensor/sensor-container";

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import DeviceContainer from "./device/device-container";
import Login from "./user/user-login";

class App extends React.Component {

    render() {
        return (
            <div className={styles.back}>
            <Router>
                <div>
                    <NavigationBar />
                    <Switch>
                        <Route
                            exact
                            path='/'
                            render={() => <Home/>}
                        />

                        <Route
                            exact
                            path='/user'
                            render={() => <UserContainer/>}
                        />

                        <Route
                            exact
                            path='/login'
                            render={() => <Login/>}
                        />
                        <Route
                            exact
                            path='/sensor'
                            render={() => <SensorContainer/>}
                        />
                        <Route
                            exact
                            path='/device'
                            render={() => <DeviceContainer/>}
                        />
                        {/*Error*/}
                        <Route
                            exact
                            path='/error'
                            render={() => <ErrorPage/>}
                        />

                        <Route render={() =><ErrorPage/>} />
                    </Switch>
                </div>
            </Router>
            </div>
        )
    };
}

export default App
