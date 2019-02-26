import * as React from "react";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";
import {Cache} from "../store/Cache";
import {AppDispatch} from "../store/appStore";
import {Container} from "../store/Container";
import {IDMap} from "../store/IDMap";
import {ContentGroup} from "./ContentGroup";
import {loadGroups} from "../store/actions/groups/LoadGroups";
import {toggleGroup} from "../store/actions/groups/ToggleGroup";


interface ReduxStateProps {
    groups: Cache<ContentGroup>,
}

interface ReduxDispatchProps {
    loadGroups: () => void,
    toggleGroup: (group: ContentGroup, enabled: boolean) => void,
}

type Props = ReduxStateProps & ReduxDispatchProps;

class UnconnectedGroupListPage extends React.Component<Props, {}> {


    constructor(props: Readonly<Props>) {
        super(props);
    }

    public componentDidMount(): void {
        if (Container.isEmpty(this.props.groups) || Container.isErrored(this.props.groups)) {
            this.props.loadGroups();
        }
    }

    public render(): React.ReactNode {
        let groupComponents = null;

        if (Container.isReady(this.props.groups)) {
            const achies = IDMap.values(this.props.groups.data);
            groupComponents = achies.map(group => <GroupListItem key={group.id} group={group}
                                                                 toggleGroup={this.props.toggleGroup}/>)
        }

        return <>
            <h1>Groups</h1>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Enabled</th>
                    <th>Toggle</th>
                </tr>
                </thead>
                <tbody>
                {groupComponents}
                </tbody>
            </table>
        </>;
    }
}


function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        groups: state.groupCache,
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadGroups: () => dispatch(loadGroups()),
        toggleGroup: (group, enabled) => dispatch(toggleGroup(group, enabled)),
    };
}

export const GroupListPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedGroupListPage);

interface GroupListItemProps {
    group: ContentGroup,
    toggleGroup: (group: ContentGroup, enabled: boolean) => void,
}

interface GroupListItemState {
    toggling?: boolean,
    toggleTo?: boolean,
}

class GroupListItem extends React.Component<GroupListItemProps, GroupListItemState> {


    constructor(props: Readonly<GroupListItemProps>) {
        super(props);

        this.state = {};
    }

    public componentDidUpdate(prevProps: Readonly<GroupListItemProps>, prevState: Readonly<GroupListItemState>, snapshot?: any): void {
        if(this.state.toggling && this.props.group.enabled === this.state.toggleTo) {
            this.setState({
                toggling: false,
                toggleTo: undefined,
            });
        }
    }

    public render(): React.ReactNode {
        return <tr>
            <td>{this.props.group.name}</td>
            <td>{this.props.group.enabled ? "Enabled" : "Disabled"}</td>
            <td>
                <button type="button" className="btn btn-primary" onClick={this.toggleGroup} disabled={this.state.toggling}>
                    {this.state.toggling ? "Toggling..." : "Toggle"}
                </button>
            </td>
        </tr>;
    }

    private toggleGroup = () => {
        this.setState({
            toggling: true,
            toggleTo: !this.props.group.enabled,
        });
        this.props.toggleGroup(this.props.group, !this.props.group.enabled);
    }
}