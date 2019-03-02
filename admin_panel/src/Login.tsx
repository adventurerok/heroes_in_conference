import * as React from "react";
import {ChangeEvent, FormEvent} from "react";
import {API} from "./api/API";
import {RouteComponentProps, withRouter} from "react-router";
import {LoginState} from "./store/LoginState";
import {connect} from "react-redux";
import {AppState} from "./store/AppState";
import {AppDispatch} from "./store/appStore";
import {setLoginState} from "./store/actions/login/SetLoginState";



interface ReduxStateProps {
    loginState: LoginState,
}

interface ReduxDispatchProps {
    setLoginState: (state: LoginState) => void,
}

interface State {
    password: string,
    statusMessage?: string,
}

type Props = ReduxStateProps & ReduxDispatchProps & RouteComponentProps<{}>;

class UnconnectedLogin extends React.Component<Props, State> {


    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            password: "",
        };
    }

    public render(): React.ReactNode {
        return <>
            <h1>Login</h1>
            <form action="#" onSubmit={this.attemptLogin}>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={this.state.password} onChange={this.passwordChanged}/>
                </div>
                <div>{this.state.statusMessage}</div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </>;
    }

    private passwordChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            password: e.target.value,
        });
    };

    private attemptLogin = (event: FormEvent) => {
        event.preventDefault();

        API.login(this.state.password).then(result => {
            if(result) {
                this.props.setLoginState(LoginState.LOGGED_IN);
            } else {
                this.props.setLoginState(LoginState.NOT_LOGGED_IN);
                this.setState({
                    statusMessage: "Incorrect password",
                });
            }
        });


    };

}

function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        loginState: state.loggedIn,
    }
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        setLoginState: state => dispatch(setLoginState(state)),
    };
}

export const Login = withRouter(connect(mapStateToProps, mapDispatchToProps)(UnconnectedLogin));