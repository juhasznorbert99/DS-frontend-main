import React from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import UserContainer from "./user/user-container";
import SensorContainer from "./sensor/sensor-container";

import ErrorPage from './commons/errorhandling/error-page';
import styles from './commons/styles/project-style.css';
import DeviceContainer from "./device/device-container";
import Login from "./user/user-login";
import ViewDetailsContainer from "./user/user-view-details";
import ViewSensorDataContainer from "./user/user-sensorData-view";
import UserChartContainer from "./user/user-chart";

class App extends React.Component {

    state = {
        userRole: "",
    }
    
    reload(){
        this.setState({userRole: JSON.parse(localStorage.getItem('clientRole'))});
        window.location.reload(false);
    }
    
    handleCallback = (role) => {
        this.setState({userRole: role})
    }

    render() {
        let {userRole} = this.state;
        return (
            <div className={styles.back}>
            <Router>
                <div>
                   <Switch>
                        <Route
                            exact
                            path='/'
                            render={() => <Login parentCallback={this.handleCallback} />}
                        />

                        <Route
                            exact
                            path='/admin/user'
                            render={() => <UserContainer />}
                        />

                        <Route
                            exact
                            path='/login'
                            render={() => <Login parentCallback={this.handleCallback} />}
                        />
                        <Route
                            exact
                            path='/admin/sensor'
                            render={() => <SensorContainer />}
                        />
                        <Route
                            exact
                            path='/admin/device'
                            render={() => <DeviceContainer />}
                        />
                        <Route
                            exact
                            path='/guest/details'
                            render={() => <ViewDetailsContainer/>}
                        />
                        <Route
                            exact
                            path='/guest/charts'
                            render={() => <UserChartContainer/>}
                        />
                        <Route
                            exact
                            path='/guest/sensorData'
                            render={() => <ViewSensorDataContainer/>}

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
