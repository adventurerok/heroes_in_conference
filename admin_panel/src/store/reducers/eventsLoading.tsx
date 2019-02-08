import {AppObjectAction} from "../AppActions";


export function reduceEventsLoading(state: boolean | undefined, action: AppObjectAction): boolean {
    switch(action.type) {
        default: {
            // or doesn't work here as false will evaluate the RHS
            return state === undefined ? false : state;
        }
    }
}