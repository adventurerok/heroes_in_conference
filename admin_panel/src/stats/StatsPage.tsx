import {Container, ContainerState} from "../store/Container";
import {UsageStat} from "./UsageStat";
import * as React from "react";
import {AppState} from "../store/AppState";
import {AppDispatch} from "../store/appStore";
import {loadUsageStats} from "../store/actions/stats/LoadUsageStats";
import {connect} from "react-redux";
import {Line} from "react-chartjs-2";
import {ChartDataSets, ChartPoint} from "chart.js";
import {API} from "../api/API";


interface ReduxStateProps {
    usageStats: Container<UsageStat[]>,
}

interface ReduxDispatchProps {
    loadUsageStats: () => void,
}

type Props = ReduxStateProps & ReduxDispatchProps;

interface State {
    userCount?: number,
}

class UnconnectedStatsPage extends React.Component<Props, State> {
    private usageInterval: number;

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {};
    }

    public componentDidMount(): void {
        this.props.loadUsageStats();

        this.usageInterval = window.setInterval(this.props.loadUsageStats, 30000);

        // load user count quickly
        API.getUserCount().then(value => this.setState({
                userCount: value,
        }));
    }

    public componentWillUnmount(): void {
        window.clearInterval(this.usageInterval);
    }

    public render(): React.ReactNode {
        let statsElement;

        switch (this.props.usageStats.state) {
            case ContainerState.EMPTY:
            case ContainerState.LOADING: {
                statsElement = <div>Loading usage stats...</div>;
                break;
            }
            case ContainerState.ERRORED: {
                statsElement = <div>Failed to load usage stats: {this.props.usageStats.error.errorMsg}</div>;
                break;
            }
            case ContainerState.MODIFIED:
            case ContainerState.DELETED: {
                statsElement = <div>Making up your own stats is not allowed!</div>;
                break;
            }
            case ContainerState.SYNCED: {
                statsElement = this.renderStatsGraph(this.props.usageStats.data);
            }
        }

        return <>
            <h1>Statistics</h1>
            <div>Total user count: {this.state.userCount !== undefined ? this.state.userCount : "Loading..."}</div>
            {statsElement}
        </>;
    }

    private renderStatsGraph = (stats: UsageStat[]) => {
        const sortedStats = stats.sort(UsageStat.sort);
        const statsDataSet: ChartPoint[] = [];
        let lastTime;

        for (const stat of sortedStats) {
            let rpm = stat.requestCount;
            if(lastTime) {
                // average over the time passed since last time
                const minutesPassed = (stat.time - lastTime) / 60000;
                rpm = rpm / minutesPassed;
            }
            // round to 1 decimal point
            rpm = Math.floor(rpm * 10) / 10;
            lastTime = stat.time;

            statsDataSet.push({
                x: stat.time,
                y: rpm,
            });
        }

        const data = {
              datasets: [{
                  label: "API Requests Per Minute",
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  pointRadius: 0,
                  data: statsDataSet,
              } as ChartDataSets]
        };

        return <Line data={data} width={100} height={150} options={{
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: "minute"
                    }
                }],
                yAxes: [{
                    type: "linear",
                }]
            }
        }}/>
    }
}

function mapStateToProps(state: AppState): ReduxStateProps {
    return {
        usageStats: state.usageStats,
    };
}

function mapDispatchToProps(dispatch: AppDispatch): ReduxDispatchProps {
    return {
        loadUsageStats: () => dispatch(loadUsageStats()),
    };
}

export const StatsPage = connect(mapStateToProps, mapDispatchToProps)(UnconnectedStatsPage);
