import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Results from './Results.jsx';
import token from '../../../token.js';

class InputForm extends React.Component {
    constructor() {
        super();

        this.state = {
            user: '',
            repo: '',
            query: '',
            dates: []
        }

        this.handleUserChange = this.handleUserChange.bind(this);
        this.handleRepoChange = this.handleRepoChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.filter = this.filter.bind(this);
        this.clear = this.clear.bind(this);
    }

    handleUserChange(e) {
        let user = e.target.value;
        this.setState({ user });
    }

    handleRepoChange(e) {
        let repo = e.target.value;
        this.setState({ repo });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.dates.length > 0 || this.state.user === '' || this.state.repo === '') {
            return null;
        }
        let username = this.state.user;
        let repo = this.state.repo;
        let query = `${username}/${repo}`;
        document.getElementById('username').value = '';
        document.getElementById('reponame').value = '';

        axios.get(`https://api.github.com/repos/${query}/commits`)
            .then(res => {
                let data = res.data;
                let avatarUrl = null;
                if (data[0].author) {
                    avatarUrl = data[0].author.avatar_url;
                }
                console.log(`avatarUrl: ${avatarUrl}`);
                let updatedState = [];
                for (let i = 0; i < data.length; i++) {
                    updatedState.push(data[i].commit.committer.date.slice(0, 10));
                }
                updatedState = this.filter(updatedState);
                this.setState({
                    dates: updatedState,
                    user: '',
                    repo: '',
                    query,
                    avatarUrl
                });
            })
            .catch(err => {
                console.log(err.stack);
                this.setState({
                    dates: 'Commits not found'
                });
            });

    }

    filter(dates) {
        if (dates.length > 0) {
            let today = new Date();
            let cutoffDate = new Date(`${today.getFullYear() - 1}-${today.getMonth() + 1}-${today.getDate()}`);
            for (let i = 0; i < dates.length; i++) {
                let commitDate = new Date(dates[i]);
                if (commitDate < cutoffDate) {
                    i === 0 ? dates = 'This repository has had no commits within the past 52 weeks.' : dates = dates.slice(0, i);
                    break;
                }
            }
            return dates;
        }
    }

    clear(e) {
        e.preventDefault();
        this.setState({
            dates: []
        });
    }

    render() {
        return (
            <Main>
                <Form>
                    <Input placeholder="user name" id="username" onChange={this.handleUserChange}></Input><br/>
                    <Input placeholder="repository name" id="reponame" onChange={this.handleRepoChange}></Input><br/>
                    <Button submit={true} onClick={this.handleSubmit}>Enter</Button>
                    <Button submit={false} canUse={this.state.dates.length > 0} onClick={this.clear}>Clear</Button>
                </Form>
                <Results avatarUrl={this.state.avatarUrl} query={this.state.query} results={this.state.dates.length > 0 ? this.state.dates : []}/>
            </Main>
        )
    }
}

const Input = styled.input`
    padding: 10px;
`;

const Button = styled.button`
    background-color: ${props => props.submit ? '#0465d6' : '#eaedf0'};
    color: ${props => props.submit ? 'white' : 'black'};
    border-radius: 10px;
    border: transparent;
    width: fit-content;
    font-size: 1em;
    padding: 10px;
    &:hover {
        cursor: pointer;
    }
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: Arial;
    padding: 20px;
`

const Main = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export default InputForm;