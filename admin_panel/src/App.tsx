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
import {AppDispatch} from "./store/appStore";
import {checkLoginState} from "./store/actions/login/CheckLoginState";
import {GroupListPage} from "./groups/GroupListPage";

interface ReduxStateProps {
    loginState: LoginState,
}

interface ReduxDispatchProps {
    checkLoginState: () => void,
}

type Props = ReduxStateProps & ReduxDispatchProps & RouteComponentProps<{}>;

class UnconnectedApp extends React.Component<Props, {}> {

    public componentDidMount(): void {
        this.onUpdate();
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
        this.onUpdate();
    }

    public render() {
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
                            <NavLink to="/achievements" className="nav-link"
                                     activeClassName="active">Achievements</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/groups" className="nav-link"
                                     activeClassName="active">Groups</NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container">
                {this.renderContainer()}
            </div>
        </>;
    }

    private renderContainer = () => {
        switch (this.props.loginState) {
            case LoginState.NOT_LOGGED_IN:
            case LoginState.UNCHECKED_COOKIE:
                return <Login />;
            case LoginState.CHECKING_COOKIE:
                return <div>Checking login cookie!</div>;
            case LoginState.LOGGED_IN: {
                return <>
                    <Route path="/maps" component={MapListPage}/>
                    <Route path="/map/:id" component={MapPage}/>
                    <Route path="/events" component={EventListPage}/>
                    <Route path="/event/:id" component={EventPage}/>
                    <Route path="/achievements" component={AchievementListPage}/>
                    <Route path="/groups" component={GroupListPage} />
                </>;
            }
        }
    };

    private onUpdate = () => {
        if(this.props.loginState === LoginState.UNCHECKED_COOKIE) {
            this.props.checkLoginState();
        }
    }
}

function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        loginState: state.loggedIn,
    }
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        checkLoginState: () => dispatch(checkLoginState())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UnconnectedApp));
