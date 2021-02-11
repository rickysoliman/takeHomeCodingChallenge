import React from 'react';
import styled from 'styled-components';

class Results extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dates: this.props.results,
            highestAverageWeekday: null,
            highestAverage: null,
            query: this.props.query
        }

        this.findAverages = this.findAverages.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            dates: newProps.results,
            highestAverage: null,
            highestAverageWeekday: null,
            query: newProps.query
        });
    } 

    findAverages() {
        if (this.state.dates.length > 0 && !this.state.highestAverage && !this.state.highestAverageWeekday) {
            const weekdays = [
                'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
            ];
            let dates = this.state.dates;
            let hashMap = {
                'Sunday': {},
                'Monday': {},
                'Tuesday': {},
                'Wednesday': {},
                'Thursday': {},
                'Friday': {},
                'Saturday': {}
            };
            for (let i = 0; i < dates.length; i++) {
                let day = new Date(dates[i]);
                let weekdayIndex = day.getDay();
                let weekday = weekdays[weekdayIndex];
                dates[i] in hashMap[weekday] ? hashMap[weekday][dates[i]]++ : hashMap[weekday][dates[i]] = 1;
            }
            let averages = {};
            for (let day in hashMap) {
                let commits = hashMap[day];
                let length = Object.keys(commits).length;
                if (length === 0) {
                    continue;
                }
                let totalCommits = 0;
                for (let date in commits) {
                    totalCommits += commits[date];
                }
                let average = totalCommits / length;
                averages[day] = average
            }
            console.log(hashMap);
            console.log(averages);
            let highestAverage = 0;
            let highestAverageWeekday = '';
            for (let day in averages) {
                if (averages[day] > highestAverage) {
                    highestAverage = averages[day];
                    highestAverageWeekday = day;
                }
            }
            if (highestAverage.toString().includes('.')) {
                let arr = highestAverage.toString().split('.');
                let num = arr[0];
                let decimal = arr[1];
                decimal[1] === '0' ? highestAverage = Number(`${num}.${decimal[0]}`) : highestAverage = highestAverage.toFixed(1);
            }
            // console.log(highestAverage);
            this.setState({
                highestAverage,
                highestAverageWeekday
            });
        }
    }

    render() {
        if (typeof this.state.dates === 'string') {
            return <div>{this.state.dates}</div>
        }
        this.findAverages();
        if (!this.state.highestAverage && !this.state.highestAverageWeekday) {
            return null;
        } else {
            return (
                <>
                    <h2>github.com/{this.state.query}</h2>
                    <div>In the past year, {this.state.highestAverageWeekday} had the highest number of commits, with an average of {this.state.highestAverage} commits per day.</div>
                </>
            )   
        }
    }
}

export default Results;