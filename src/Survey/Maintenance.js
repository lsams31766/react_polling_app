import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom';

class Maintenance extends Component { 
    constructor(props) {
        super(props)
        this.classes = this.useStyles;
        this.state = {
            survey_titles: null,
            question_and_answers: null,
            original_title: null,
            edited_title: null,
            queston: null,
            answers: []
        }
    }
    
    //const [value, setValue] = React.useState('female');

    componentDidMount() {
        // debugger
        // load survey titles
        fetch('http://127.0.0.1:5000/')
            .then(response => response.json())
            .then((survey_titles) => {
            this.setState({ survey_titles })
        })
    }

    useStyles = makeStyles((theme) => ({
        root: {
          width: '100%',
          maxWidth: 360,
          backgroundColor: theme.palette.background.paper,
        },
      }));


    /*
    handleTextFieldChange = (event, value) => {
        this.setState({
            username: event.target.value
        })
    }
    */

   handleTitleFieldChange = (event) => {
       this.setState({
           selected_title: event.target.value
       })
   }

   handleQuestionChange = (event) => {
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

    deleteAnswer = (index) => (event) => {
        // debugger
        // console.log('answer index',index)
        let answers = [...this.state.answers]
        answers.splice(index,1)
        this.setState({answers})
    }

    addAnswer = () => {
        // debugger
        let answers = [...this.state.answers]
        answers.push("???")
        this.setState({answers})
    }
    

   loadQuestions(original_title,question_and_answers) {
    // after feteching questions, load the questions screen
        // debugger
        this.setState({selected_title: original_title})
        this.setState({question: question_and_answers.question})
        this.setState({answers: question_and_answers.answers })
        console.log('Mainenance loadQuestions fetch response',question_and_answers)
   }

   onSurveyItemClickHandler(original_title) {
    console.log('onSurveyItemClickHandler ',original_title,"item clicked")
    // this.props.history.push("/questions")
    // fetch selected title from backend to get question and answers
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ "title":original_title })
    }
    fetch('http://localhost:5000/questions',requestOptions)
      .then(response => response.json())
      .then((question_and_answers) => {
        this.loadQuestions(original_title,question_and_answers)
      })
  }

    goHome() {
        this.props.history.push({
          pathname: "/"
        })
    }

    handleSubmit = (event) => {
        // debugger
        // TODO - call update endpoint
        event.preventDefault()
        /*
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
        */
    }
    render() {
        // debugger
        if (!this.state.survey_titles)
            return null
        let surveys = this.state.survey_titles
        let answers = this.state.answers
        return (
        <div>
            <h1>Choose A survey to maintain:</h1>
            <div className={this.classes.root}>
                <List component="nav" aria-label="Survey List Mapped">
                    {surveys.map((original_title) =>
                    <ListItem key={original_title} button 
                        onClick={() => this.onSurveyItemClickHandler(original_title) }>
                        <ListItemText primary={original_title}/>
                    </ListItem>
                    )}
                </List>
                <div>
                    {this.state.selected_title != null 
                        ? <div>
                            <p>Selected Title</p>
                            <TextField id="outlined-basic" label="title" variant="outlined" 
                                value={this.state.selected_title}
                                onChange={this.handleTitleFieldChange}
                            />
                            <p>Question</p>
                            <TextField id="outlined-basic" label="" variant="outlined" 
                                value={this.state.question}
                                onChange={this.handleQuestionChange}
                            />
                            <p>Answers</p>
                            {answers.map((answer, index) =>
                            <div>
                            <TextField id="outlined-basic" label="" variant="outlined" 
                                value={answer}
                                onChange={this.handleAnswerChange(index)}
                                />
                            <Button variant="contained" color="secondary" style={{marginBottom: 10}}
                                onClick={this.deleteAnswer(index)}>
                                Delete Answer
                            </Button>
                            </div>
                            )}                            
                            <Button variant="contained" color="secondary" style={{marginBottom: 10}}
                            onClick={this.addAnswer}>
                            Add Answer
                            </Button>
                        </div>                      
                        : <p>No title selected</p>
                    }
                </div>
            </div>
        </div>
        )}
    }

export default Maintenance;
