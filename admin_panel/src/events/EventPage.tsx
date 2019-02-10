import {RouteComponentProps} from "react-router";
import * as React from "react";
import {ChangeEvent} from "react";
import {AppState} from "../store/AppState";
import {AppDispatch} from "../store/appStore";
import {connect} from "react-redux";
import {Event} from "./Event";
import {Container} from "../store/Container";
import {loadEvents} from "../store/actions/LoadEvents";
import {DateTimeLocal} from "../util/DateTimeLocal";
import {eventModified} from "../store/actions/EventModified";
import {deleteEvent} from "../store/actions/DeleteEvent";

interface RouteParams {
    id: string,
}

interface ReduxStateProps {
    event: Container<Event>,
    allEvents: Container<{}>
}

interface ReduxDispatchProps {
    loadEvents: () => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}

type ConnectedProps = RouteComponentProps<RouteParams>;

type Props = ConnectedProps & ReduxStateProps & ReduxDispatchProps;

interface State {
    event?: Event,
    pendingSave?: boolean,
    pendingDelete?: boolean,
}

class UnconnectedEventPage extends React.Component<Props, State> {

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {};
    }

    public componentDidMount(): void {
        if (Container.isEmpty(this.props.allEvents)) {
            this.props.loadEvents();
        }

        this.onUpdate();
    }

    public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>): void {
        this.onUpdate();
    }

    public render(): React.ReactNode {
        if (!Container.isReady(this.props.allEvents)) {
            return <div>Loading event...</div>;
        }

        if (!Container.isReady(this.props.event)) {
            return <div>No event exists for this id, perhaps it was deleted?</div>;
        }

        if (!this.state.event) {
            // this one probably shouldn't appear for more than 1ms
            return <div>The event has loaded, we await it to be copied into state</div>;
        }

        const event = this.state.event;

        let pendingMessage = null;
        if (this.state.pendingSave) {
            if (Container.isModified(this.props.event) && this.props.event.error) {
                pendingMessage = "Error while saving " + this.props.event.error.errorMsg;
            } else {
                pendingMessage = "Saving event...";
            }
        } else if (this.state.pendingDelete) {
            if (Container.isModified(this.props.event) && this.props.event.error) {
                pendingMessage = "Error while deleting " + this.props.event.error.errorMsg;
            } else {
                pendingMessage = "Deleting event...";
            }
        }

        return <>
            <h1>Modifying event</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Event Name</label>
                    <input type="text" className="form-control" id="name"
                           placeholder="Event Name" value={event.name} onChange={this.textChanged}/>
                </div>
                <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" className="form-control" id="location"
                           placeholder="RuneFest 2019" value={event.location} onChange={this.textChanged}/>
                </div>
                <div className="form-group">
                    <label htmlFor="startTime">Start Time</label>
                    <DateTimeLocal className="form-control"
                                   dateTime={event.startTime} onChange={this.startTimeChanged}/>
                </div>
                <div className="form-group">
                    <label htmlFor="endTime">End Time</label>
                    <DateTimeLocal className="form-control"
                                   dateTime={event.endTime} onChange={this.endTimeChanged}/>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" id="description"
                              value={event.description} onChange={this.textChanged}/>
                </div>
                <div>{pendingMessage}</div>
                <div>
                    <button type="button" className="btn btn-success mr-1" onClick={this.updateAndReturnToList}>Update
                    </button>
                    <button type="button" className="btn btn-outline-info" onClick={this.cancel}>Cancel</button>
                    <button type="button" className="btn btn-danger float-right" onClick={this.delete}>Delete</button>
                </div>
            </form>
        </>;
    }

    private onUpdate = () => {

        // when the event has loaded, we copy it into state so we can work on a copy instead of changing the original
        if (Container.isReady(this.props.event) && !this.state.event) {
            this.setState({
                event: this.props.event.data,
            });
        }

        // Save success
        if (this.state.pendingSave && Container.isSynced(this.props.event)) {
            // navigate back to events
            this.props.history.replace("/events");
        }

        // Delete success
        if (this.state.pendingDelete && Container.isEmpty(this.props.event)) {
            this.props.history.replace("/events");
        }
    };

    private changeEvent = (changes: Partial<Event>) => {
        // block changing the event if it hasn't loaded
        if (!this.state.event) {
            return;
        }

        this.setState((state) => {
            if (!state.event) {
                throw new Error("We can't change state if we haven't loaded");
            }

            return {
                event: {
                    ...state.event,
                    ...changes,
                }
            };
        });
    };

    private textChanged = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.changeEvent({
            [e.target.id]: e.target.value,
        });
    };

    private startTimeChanged = (dateTime: number) => {
        this.changeEvent({
            startTime: dateTime,
        });
    };

    private endTimeChanged = (dateTime: number) => {
        this.changeEvent({
            endTime: dateTime,
        });
    };

    private updateAndReturnToList = () => {
        // prevent button before loading
        if (!this.state.event) {
            return;
        }

        // pendingSave true tells componentDidUpdate to look for when the input event container changes to Synced
        this.setState({
            pendingSave: true
        });

        this.props.updateEvent(this.state.event);
    };

    private cancel = () => {

        // go back
        this.props.history.replace("/events");
    };

    private delete = () => {
        if (!this.state.event) {
            return;
        }

        this.setState({
            pendingDelete: true,
        });

        this.props.deleteEvent(this.state.event);
    };

}

function mapStateToProps(state: AppState, ownProps: ConnectedProps): ReduxStateProps {
    const eventId = ownProps.match.params.id;

    return {
        event: state.events[eventId] || Container.empty(),
        allEvents: state.allEvents,
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadEvents: () => dispatch(loadEvents()),
        updateEvent: (event) => dispatch(eventModified(Container.modified(event, Date.now()))),
        deleteEvent: (event) => dispatch(deleteEvent(event))
    };
}

export const EventPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedEventPage);