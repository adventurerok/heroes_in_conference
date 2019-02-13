import * as React from "react";
import {ConferenceMap} from "./ConferenceMap";
import {Container} from "../store/Container";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";
import {RouteComponentProps} from "react-router";

interface RouteParams {
    id: string,
}

interface ReduxStateProps {
    map: Container<ConferenceMap>,
}

type ConnectedProps = RouteComponentProps<RouteParams>;

type Props = ConnectedProps & ReduxStateProps;

class UnconnectedMapPage extends React.Component<Props, {}> {

    public render(): React.ReactNode {
        if(!Container.isReady(this.props.map)) {
            return <div>No map exists with this id</div>;
        }

        const map = this.props.map.data;

        return <>
            <h1>Modifying Map</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Map Name</label>
                    <input type="text" className="form-control" id="name"
                           placeholder="Event Name" value={map.name} onChange={this.mapTitleChanged}/>
                </div>
            </form>
        </>;
    }

    private mapTitleChanged = () => {
        // TODO
    }

}

function mapStateToProps(state: AppState, ownProps: ConnectedProps): ReduxStateProps {
    let map : Container<ConferenceMap> = Container.empty();
    const id = ownProps.match.params.id;
    if(Container.isReady(state.mapCache) && state.mapCache.data[id]) {
        map = Container.synced(state.mapCache.data[id], state.mapCache.modified);
    }

    return {
        map,
    };
}

export const MapPage = connect(mapStateToProps)(UnconnectedMapPage);