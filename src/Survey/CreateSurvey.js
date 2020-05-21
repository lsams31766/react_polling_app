import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';

class CreateSurvey extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            question: '',
            answers: ['']
        }
        this.addAnswer = this.addAnswer.bind(this)
        this.handleAnswerChange = this.handleAnswerChange.bind(this)
    }
    
    componentDidMount() {
        // debugger
    }

    handleTitleChange = (event, value) => {
        this.setState({
            title: event.target.value
        })
    }

    handleQuestionChange = (event, value) => {
        this.setState({
            question: event.target.value
        })
    }

    handleAnswerChange = (index) => (event) => {
        // debugger
        // console.log('answer index',index)
        let answers = [...this.state.answers]
        let answer = event.target.value
        answers[index] = answer
        this.setState({answers})
    }

    goHome() {
        this.props.history.push({
          pathname: "/"
        })
    }

    addAnswer = () => {
        // debugger
        let answers = [...this.state.answers]
        answers.push("???")
        this.setState({answers})
    }

    handleSubmit = (event) => {
        // debugger
        event.preventDefault()
        console.log('CreateSurvey handleSubmit() state',this.state)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                 "title":this.state.title,
                 "question":this.state.question,
                 "answers":this.state.answers 
            })
          }
          fetch('http://localhost:5000/create',requestOptions)
            .then(response => response.json())
            .then((data) => {
              this.goHome()
            })
    }
    render() {
        const answers = this.state.answers
        //debugger
        return (
            <form onSubmit={this.handleSubmit}>
            <h2>Create a New Survey</h2>
            <FormControl component="fieldset" margin="normal">
            <TextField id="outlined-basic" label="title" variant="outlined" 
                style={{width: 300, marginBottom: 10}}  
                value={this.state.title}
                onChange={this.handleTitleChange}
                key={"title"}
            />
            <TextField id="outlined-basic" label="question" variant="outlined" 
                style={{width: 500, marginBottom: 10}}  
                value={this.state.question}
                onChange={this.handleQuestionChange}
                key={"question"}
            />
            <div>
                {answers.map((answer, index) =>
                <div>
                <TextField id="outlined-basic" label="" variant="outlined" 
                    value={answer}
                    onChange={this.handleAnswerChange(index)}
                    />
                </div>
                )}        
            </div>

            <Button variant="contained" color="secondary" style={{marginBottom: 10}}
                onClick={this.addAnswer}>
                Add Answer
            </Button>
            <Button type="submit" variant="contained" color="primary">Submit</Button>
            <p><Link to="/">Home</Link></p>
            </FormControl>
            </form>
        );
    }
}

export default CreateSurvey;
