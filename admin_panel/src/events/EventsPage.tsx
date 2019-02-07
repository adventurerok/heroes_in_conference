import * as React from "react";
import {Event, sortEvents} from "./Event"
import {format} from "date-fns";

interface EventsPageState {
    events: Event[]
}

const mockEvents: Event[] = [
    {
        id: "1",
        description: "The first event",
        name: "First",
        startTime: new Date(2019, 1, 1),
        endTime: new Date(2019, 1, 2),
    },
    {
        id: "2",
        description: "The second event",
        name: "Second",
        startTime: new Date(2019, 1, 5),
        endTime: new Date(2019, 1, 8),
    }
];

export class EventsPage extends React.Component<{}, EventsPageState> {


    public constructor(props: Readonly<{}>) {
        super(props);

        this.state = {
            events: mockEvents.slice()
        }
    }

    public render(): React.ReactNode {
        const eventComponents = [];

        const sortedEvents = this.state.events.sort(sortEvents);

        for(const event of sortedEvents) {
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

interface EventDisplayProps {
    event: Event
}

class EventDisplay extends React.Component<EventDisplayProps, {}> {

    public render(): React.ReactNode {
        return <tr>
            <td>{this.props.event.name}</td>
            <td>{this.props.event.description}</td>
            <td>{format(this.props.event.startTime, "dd HH:mm")}</td>
            <td>{format(this.props.event.endTime, "dd HH:mm")}</td>
            <td>{this.props.event.location || "None"}</td>
        </tr>;
    }
}