import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";


interface ReduxStateProps {

}

type Props = ReduxStateProps;

class UnconnectedAchievementListPage extends React.Component<Props, {}> {


    constructor(props: Readonly<Props>) {
        super(props);
    }

    public render(): React.ReactNode {
        return <h1>Achievements</h1>;
    }
}


function mapStateToProps(state: AppState): ReduxStateProps {
    return {

    };
}

export const AchievementListPage = connect(mapStateToProps)(UnconnectedAchievementListPage);