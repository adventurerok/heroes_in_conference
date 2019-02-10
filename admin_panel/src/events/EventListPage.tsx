import * as React from "react";
import {Event, sortEvents} from "./Event"
import {format} from "date-fns";
import {connect} from "react-redux";
import {AppState} from "../store/AppState";
import {IDMap} from "../store/IDMap";
import {AppDispatch} from "../store/appStore";
import {loadEvents} from "../store/actions/LoadEvents";
import {Container} from "../store/Container";


// props to be passed in by mapStateToProps
interface ReduxStateProps {
    events: Event[],
    allEvents: Container<{}> // state of loading all events
}

// props to be passed in by mapDispatchToProps
interface ReduxDispatchProps {
    loadEvents: () => void,
}

// combined props type
type Props = ReduxStateProps & ReduxDispatchProps;

// unconnected component
class UnconnectedEventListPage extends React.Component<Props, {}> {


    public constructor(props: Readonly<Props>) {
        super(props);

    }

    public componentDidMount(): void {
        if(Container.isEmpty(this.props.allEvents)) {
            this.props.loadEvents();
        }
    }

    public render(): React.ReactNode {
        const eventComponents = [];


        for(const event of this.props.events) {
            eventComponents.push(<EventDisplay key={event.id} event={event}/>);
        }

        return <>
            <h1>Events</h1>
            <table className="table">
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Location</th>
                </tr>
            {eventComponents}
            </table>
        </>;
    }
}

function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        events: IDMap.values(state.events).filter(Container.isReady).map(e => e.data).sort(sortEvents),
        allEvents: state.allEvents,
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadEvents: () => dispatch(loadEvents())
    };
}

export const EventListPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedEventListPage);

// event display item
interface EventDisplayProps {
    event: Event
}

class EventDisplay extends React.Component<EventDisplayProps, {}> {

    public render(): React.ReactNode {
        return <tr>
            <td>{this.props.event.name}</td>
            <td>{this.props.event.description}</td>
            <td>{format(this.props.event.startTime, "MMM d HH:mm")}</td>
            <td>{format(this.props.event.endTime, "MMM d HH:mm")}</td>
            <td>{this.props.event.location || "None"}</td>
        </tr>;
    }
}