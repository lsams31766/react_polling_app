import React, { Component } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';

class DocumentInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    handleChange = (event, value) => {
        this.setState({
            value: event.target.value
        })
    }

    render() {
        return <div><TextField id="outlined-basic" label="answer" variant="outlined" 
        style={{width: 500}}  
        value={this.value}
        onChange={this.handleChange}
        name= { `answer_field-${ this.props.index }-answer_field` }
        /></div>        
    }
}

class CreateSurvey extends Component { 
    constructor(props) {
        super(props)
        this.state = {
            title: '',
            question: '',
            answers: [],
            answer_fields: []
        }
        this.addAnswer = this.addAnswer.bind(this)
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

    goHome() {
        this.props.history.push({
          pathname: "/"
        })
    }

    addAnswer() {
        console.log("add answer field")
        const answer_fields = this.state.answer_fields.concat(DocumentInput)
        this.setState({ answer_fields })
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
        const answer_fields = this.state.answer_fields.map((Element, index) => {
            return <Element key={index} index={index} />
        })       
        //debugger
        return (
            <form onSubmit={this.handleSubmit}>
            <h2>Create a New Survey</h2>
            <FormControl component="fieldset">
            <TextField id="outlined-basic" label="title" variant="outlined" 
                style={{width: 300}}  
                value={this.state.title}
                onChange={this.handleTitleChange}
            />
            <TextField id="outlined-basic" label="question" variant="outlined" 
                style={{width: 500}}  
                value={this.state.question}
                onChange={this.handleQuestionChange}
            />
            <div className="inputs">
                { answer_fields }
            </div>

            <Button variant="contained" color="secondary"
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
