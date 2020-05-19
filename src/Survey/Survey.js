import React, { Component } from 'react';
import { Redirect } from 'react-router'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

class Survey extends Component {
  constructor(props) {
    super(props)
    this.classes = this.useStyles;
    //TODO fetch list of survey titles from API
    //this.surveys = ['Best Movie','Best Deli Meat']
    console.log('Survey props',props)
    this.state = {
      survey_titles:[],
      selected_title: '',
      question: '',
      answers: []
    }
  }
  componentDidMount() {
    //debugger
    console.log('Survey got props',this.props.location.state)
    this.setState({
      survey_titles: this.props.location.state.survey_titles
    })
    console.log("Survey componentDidMount state",this.state)
  }

  useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
  }));

  ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  loadQuestions(selected_title,question_and_answers) {
    // after feteching questions, load the questions screen
    // debugger
    this.setState({selected_title})
    this.setState({question: question_and_answers.question})
    this.setState({answers: question_and_answers.answers })
    console.log('Survey fetch response',question_and_answers)

    this.props.history.push({
      pathname: "/questions",
      state: { 
        selected_title: this.state.selected_title,
        question: this.state.question,
        answers: this.state.answers
      }
    })
}

  onItemClickHandler(selected_title) {
    // debugger
    console.log(selected_title,"item clicked")
    // this.props.history.push("/questions")
    // fetch selected title from backend to get question and answers
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ "title":selected_title })
    }
    fetch('http://localhost:5000/questions',requestOptions)
      .then(response => response.json())
      .then((question_and_answers) => {
        this.loadQuestions(selected_title,question_and_answers)
      })
  }
    render() {
      //debugger
      if (!this.state.survey_titles)
        return null
      let surveys = this.state.survey_titles
      return (
      <div>
        <h1>Choose A survey to take:</h1>
        <div className={this.classes.root}>
          <List component="nav" aria-label="Survey List Mapped">
            {surveys.map((title) =>
              <ListItem key={title} button 
                  onClick={() => this.onItemClickHandler(title) }>
                <ListItemText primary={title}/>
              </ListItem>
            )}
          </List>
        </div>
      </div>
      )}
}

export default Survey;

