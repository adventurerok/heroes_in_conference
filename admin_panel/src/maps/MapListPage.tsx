import * as React from "react";
import {ConferenceMap} from "./ConferenceMap";
import {Link} from "react-router-dom";

interface ReduxStateProps {
    maps: ConferenceMap[],
}

type Props = ReduxStateProps;

export class MapListPage extends React.Component<Props, {}> {

    public render(): React.ReactNode {
        const mapComponents = this.props.maps.map(map => <MapListItem key={map.id} map={map}/>);

        return <>
            <h1>Maps</h1>
            <button type="button" className="btn btn-primary" onClick={this.newMap}>New Map</button>
            <br/>
            <table className="table">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Path</th>
                </tr>
                </thead>
                <tbody>
                {mapComponents}
                </tbody>
            </table>
        </>;
    }

    private newMap = () => {
        // TODO go to new map page
    };
}

interface MapListItemProps {
    map: ConferenceMap,
}

class MapListItem extends React.Component<MapListItemProps, {}> {

    public render(): React.ReactNode {
        return <tr>
            <td><Link to={"/map/" + this.props.map.id}>{this.props.map.name}</Link></td>
            <td>{this.props.map.path}</td>
        </tr>;
    }
}