import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";
import {Achievement} from "./Achievement";
import {Cache} from "../store/Cache";
import {AppDispatch} from "../store/appStore";
import {loadAchievements} from "../store/actions/achievements/LoadAchievements";
import {Container} from "../store/Container";
import {IDMap} from "../store/IDMap";


interface ReduxStateProps {
    achievements: Cache<Achievement>,
}

interface ReduxDispatchProps {
    loadAchievements: () => void,
}

type Props = ReduxStateProps & ReduxDispatchProps;

class UnconnectedAchievementListPage extends React.Component<Props, {}> {


    constructor(props: Readonly<Props>) {
        super(props);
    }

    public componentDidMount(): void {
        if (Container.isEmpty(this.props.achievements) || Container.isErrored(this.props.achievements)) {
            this.props.loadAchievements();
        }
    }

    public render(): React.ReactNode {
        let achieComponents = null;

        if (Container.isReady(this.props.achievements)) {
            const achies = IDMap.values(this.props.achievements.data);
            achieComponents = achies.map(achie => <AchieListItem key={achie.id} achievement={achie}/>)
        }

        return <>
            <h1>Achievements</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Count</th>
                </tr>
                </thead>
                <tbody>
                {achieComponents}
                </tbody>
            </table>
        </>;
    }
}


function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        achievements: state.achievementCache,
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadAchievements: () => dispatch(loadAchievements()),
    };
}

export const AchievementListPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedAchievementListPage);

interface AchieListItemProps {
    achievement: Achievement,
}

class AchieListItem extends React.Component<AchieListItemProps, {}> {

    public render(): React.ReactNode {
        return <tr>
            <td>{this.props.achievement.name}</td>
            <td>{this.props.achievement.count}</td>
        </tr>;
    }
}