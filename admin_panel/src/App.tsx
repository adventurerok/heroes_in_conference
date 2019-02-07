import * as React from 'react';
import {Route} from "react-router";
import './App.css';

import {EventsPage} from "./events/EventsPage";
import {MapPage} from "./map/MapPage";

class App extends React.Component {
    public render() {
        return <div>
            <p>Hello there!</p>
            <Route path="/map" component={MapPage}/>
            <Route path="/events" component={EventsPage} />
        </div>;
    }
}

export default App;
