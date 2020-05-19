import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Link } from 'react-router-dom';

class Results extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            survey_titles: [],
            selected_title: '?',
            results: null
        }
        this.classes = this.useStyles;
    }

    useStyles = makeStyles((theme) => ({
        formControl: {
          margin: theme.spacing(1),
          minWidth: 120,
        },
        selectEmpty: {
          marginTop: theme.spacing(2),
        },
        table: {
            maxWidth: 100,
            },
      }));

      handleSelectdChange = (event, value) => {
        this.setState({
            selected_title: event.target.value
        })
        // load poll results
        this.loadResults(event.target.value)
    }


    loadResults(title) {
        //debugger
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ "title":title })
          }
        fetch('http://localhost:5000/results',requestOptions)
        .then(response => response.json())
        .then((results) => {
            this.setState({
                results:results
            })
        })
    }

    initialLoad(survey_titles) {
        this.setState({ survey_titles})
        this.loadResults(survey_titles[0])
        this.setState({ selected_title: survey_titles[0]})
    }

    componentDidMount() {
        //debugger
        console.log('Results componentDidMount() got props',this.props.location.state)
       // fetch results
       fetch('http://127.0.0.1:5000/')
       .then(response => response.json())
       .then((survey_titles) => this.initialLoad(survey_titles))
    }
 
    render() {
        if (!this.state.results)
           return null
        let results = this.state.results
        let titles = this.state.survey_titles
        console.log('Results',results)
        return(
            <div>
            <FormControl className={this.classes.formControl}>
                <InputLabel id="demo-simple-select-label">Survey</InputLabel>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={this.state.selected_title}
                onChange={this.handleSelectdChange}>
                {titles.map((title) =>
                    <MenuItem value={title}>{title}</MenuItem>
                )}
                </Select>
        </FormControl>



            <h3>Survey Results</h3>
            <TableContainer component={Paper} >
            <Table className={this.classes.table} aria-label="simple table" style={{width: '30%'}}>
                <TableHead>
                <TableRow>
                    <TableCell>Answer</TableCell>
                    <TableCell align="left">Count</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {results.map((row) => (
                    <TableRow key={row.answer}>
                    <TableCell component="th" scope="row">
                        {row.answer}
                    </TableCell>
                    <TableCell align="left">{row.count}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
            </TableContainer>
            <p><Link to="/">Home</Link></p>
            </div>
        )
    };
}

export default Results;
