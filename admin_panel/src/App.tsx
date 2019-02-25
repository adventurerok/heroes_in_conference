import * as React from 'react';
import {Route, RouteComponentProps, withRouter} from "react-router";
import './App.css';

import {EventListPage} from "./events/EventListPage";
import {MapListPage} from "./maps/MapListPage";
import {NavLink} from "react-router-dom";
import {EventPage} from "./events/EventPage";
import {MapPage} from "./maps/MapPage";
import {Login} from "./Login";
import {LoginState} from "./store/LoginState";
import {connect} from "react-redux";
import {AppState} from "./store/AppState";
import {AchievementListPage} from "./achievements/AchievementListPage";

interface ReduxStateProps {
    loginState: LoginState,
}

type Props = ReduxStateProps & RouteComponentProps<{}>;

class UnconnectedApp extends React.Component<Props, {}> {
    public render() {
        const loggedIn = this.props.loginState === LoginState.LOGGED_IN;

        return <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse"
                        data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink to="/" exact={true} className="nav-link" activeClassName="active">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/maps" className="nav-link" activeClassName="active">Maps</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/events" className="nav-link" activeClassName="active">Events</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/achievements" className="nav-link" activeClassName="active">Achievements</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            {loggedIn &&
            <div className="container">
                <Route path="/maps" component={MapListPage}/>
                <Route path="/map/:id" component={MapPage}/>
                <Route path="/events" component={EventListPage}/>
                <Route path="/event/:id" component={EventPage}/>
                <Route path="/achievements" component={AchievementListPage}/>
            </div>
            }
            {!loggedIn &&
            <div className="container">
                <Login/>
            </div>
            }
        </>;
    }
}

function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        loginState: state.loggedIn,
    }
}

export default withRouter(connect(mapStateToProps)(UnconnectedApp));
