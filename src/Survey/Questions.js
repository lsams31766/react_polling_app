import React, { Component } from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';

class Questions extends Component { 
    constructor(props) {
        super(props)
        console.log('Questions props',props)
        this.state = {
            question: null,
            selected_answer: '',
            username: ''
        }
    }
    
    //const [value, setValue] = React.useState('female');

    componentDidMount() {
        // debugger
        console.log('Questions componentDidMount() got props',this.props.location.state)
        this.setState({
            question: this.props.location.state.question,
            answers: this.props.location.state.answers,
            selected_title: this.props.location.state.selected_title,
            selected_answer: '',
            username: ''
        })
        console.log('Questions componentDidMount() state',this.state)
    }

    handleRadioChange = (event, value) => {
        // debugger
        console.log("radio:",value)        
        this.setState({
            selected_answer: value
        })
        
    };

    handleTextFieldChange = (event, value) => {
        this.setState({
            username: event.target.value
        })
    }

    goHome() {
        this.props.history.push({
          pathname: "/"
        })
    }

    handleSubmit = (event) => {
        // debugger
        event.preventDefault()
        console.log('Questions handleSubmit() state',this.state)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                 "title":this.state.selected_title,
                 "username":this.state.username,
                 "answer":this.state.selected_answer 
            })
          }
          fetch('http://localhost:5000/answers',requestOptions)
            .then(response => response.json())
            .then((data) => {
              this.goHome()
            })
    }
    render() {
        //debugger
        console.log('Questions render()')
        console.log('Questions render() state',this.state)
        if (!this.state.question)
            return null
        let question = this.state.question
        let answers = this.state.answers
        return (
            <form onSubmit={this.handleSubmit}>
            <FormControl component="fieldset">
            <p>{question}</p>
            <FormLabel component="legend">Choose</FormLabel>
            <RadioGroup aria-label="Choose" name="choice" value={this.state.selected_answer} onChange={this.handleRadioChange}>
            {answers.map((choice) =>
                <FormControlLabel value={choice} key={choice} control={<Radio />} label={choice} />
            )}
            </RadioGroup>
            <TextField id="outlined-basic" label="username" variant="outlined" 
                value={this.state.username}
                onChange={this.handleTextFieldChange}
            />
            <Button type="submit" variant="contained" color="primary">Submit</Button>
            <p><Link to="/">Home</Link></p>
            </FormControl>
            </form>
        );
    }
}

export default Questions;
