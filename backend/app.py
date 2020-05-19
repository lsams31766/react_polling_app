from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Integer, ForeignKey, func
from sqlalchemy.orm import scoped_session, sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
engine = create_engine('sqlite:///test.db')

DBSession = scoped_session(sessionmaker())
DBSession.configure(bind=engine)

#db model stuff
Base = declarative_base()

class Survey(Base):
    __tablename__ = 'surveys'
    id = Column(Integer, primary_key=True)
    question = Column(String(40))
    title = Column(String(40))
    answers = relationship('Answer', backref='answer_list')

    def __repr__ (self):
        return "<Survey(question='%s')>" % self.question

class Answer(Base):
    __tablename__ = 'answers'
    id = Column(Integer, primary_key=True)
    survey_id = Column(Integer, ForeignKey('surveys.id'))
    answer = Column(String(40))
    votes = relationship('Vote', backref='vote_list')

    def __repr__ (self):
        return "<Answer(answer='%s')>" % self.answer

class Vote(Base):
    __tablename__ = 'votes'
    id = Column(Integer, primary_key=True)
    answer_id = Column(Integer, ForeignKey('answers.id'))
    username = Column(String(40))
    vote_nbr = Column(Integer)

    def __repr__ (self):
        return "<Vote(username='%s', vote_nbr='%d')>" % (self.username, self.vote_nbr)

def make_survey(title, question, answers):
    survey = Survey(title=title,question=question)
    DBSession.add(survey)
    DBSession.commit()
    # make answers
    for answer in answers:
        ans = Answer(answer=answer, survey_id=survey.id)
        DBSession.add(ans)
    DBSession.commit()
    return survey.id

#start the app
# DO this only once
'''
Base.metadata.create_all(engine)
# put in 2 surveys

answers = ['Star Wars','Earthquake','Gone With The Wind','Titanic']
survey_id = make_survey("Best Movie","What is the best movie ever?",answers)
answers = ['Roast Beef','Salami','Turkey']
survey_id = make_survey("Best Deli Meat","What is the Best Deli Meat?",answers)
'''

def addVote(data):
    survey = DBSession.query(Survey).filter(Survey.title == data['title']).first()
    answers = DBSession.query(Answer).filter(Answer.survey_id == survey.id)
    answer_list = [a.answer for a in answers]
    answer = DBSession.query(Answer).\
        filter(Answer.survey_id == survey.id).\
        filter(Answer.answer == data['answer']).first()
    vote_nbr = answer_list.index(data['answer']) + 1
    new_vote = Vote(username=data['username'], vote_nbr=vote_nbr,answer_id=answer.id)
    DBSession.add(new_vote)
    DBSession.commit()

def aggregate(title):
    survey = DBSession.query(Survey).filter(Survey.title == title).first()
    result = DBSession.query(Answer.answer, func.count(Answer.answer)).\
        join(Vote).\
        filter(Answer.survey_id == survey.id).\
        group_by(Answer.answer).all()
    d_list = []
    for row in result:
        d = {}
        d["answer"] = row[0]
        d["count"] = row[1]
        d_list.append(d)
    return d_list # list of dicts


# FOR NOW we will just send back canned data, later it will access the DB
@app.route('/')
def index():
    #Test with: curl -i -X GET http://127.0.0.1:5000
    #return all the surveys
    #surveys = ['Best Movie', 'Best Deli Meat']
    surveys = DBSession.query(Survey).all()
    survey_list = [s.title for s in surveys]
    return jsonify(survey_list)

@app.route('/questions', methods = ['POST'])
def questions():
    #Test with: 
    #  curl -i -X POST -H 'Content-Type: application/json' -d '{"title":"Best Movie"}' http://127.0.0.1:5000/questions
    #  OR
    # curl -i -X POST -H 'Content-Type: application/json' -d '{"title":"Best Deli Meat"}' http://127.0.0.1:5000/questions
    # return questions for the survey title
    data = request.json
    # format is "title:title"
    survey = DBSession.query(Survey).filter(Survey.title == data['title']).first()
    question = survey.question
    answers = DBSession.query(Answer).filter(Answer.survey_id == survey.id)
    answer_list = [a.answer for a in answers]
    return jsonify({
        'question':question,
        'answers':answer_list
    })

@app.route('/answers', methods = ['POST'])
def answers():
    #Test with: 
    #  curl -i -X POST -H 'Content-Type: application/json' -d '{"title":"Best Movie", "answer":"Earthquake","username":"Larry"}' http://127.0.0.1:5000/results
    #  returns "message":"OK"
    data = request.json
    # format is "title:title","username":username,"answer":answer
    addVote(data)
    return jsonify({
        'message':'OK'
    })

@app.route('/results', methods = ['POST'])
def results():
    #Test with: 
    #  curl -i -X POST -H 'Content-Type: application/json' -d '{"title":"Best Movie"}' http://127.0.0.1:5000/results
    #  returns "message":"OK"
    data = request.json
    # format is "title:title","username":username,"answer":answer
    ret = aggregate(data['title'])
    return json.dumps(ret)

@app.route('/create', methods = ['POST'])
def create():
    #Test with: 
    #  curl -i -X POST -H 'Content-Type: application/json' -d 
    #    '{"title":"Best Car","question":"What is the Best Car?",
    #      "answers":["Chevy","Cadillac","Mustang","Hummer"]}' 
    #    http://127.0.0.1:5000/create
    #  returns "message":"OK"
    data = request.json
    survey_id = make_survey(data['title'],data['question'],data['answers'])
    return jsonify({
        'message':'OK'
    })

if __name__ == '__main__':
    app.run(debug=True)




