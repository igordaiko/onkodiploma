import React, { Component } from 'react';
import {Translate, I18n} from 'react-redux-i18n';
import PropTypes from 'prop-types';
import Question from 'Containers/Question'
import _ from 'lodash';
import ReactPaginate from 'react-paginate';
import * as actions from 'actions/contentActions'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux';

export class Questions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageCount: 0,
            page: 0,
            questionsToPage: [],
            itemsCount: 0
        };
        this.handlePageClick = this.handlePageClick.bind(this);
        this.getAnswer = this.getAnswer.bind(this);

    }

    componentDidMount() {
        if (this.props.questions.length > 0) {
            var pageCount = this.props.questions.length / 10;
            this.setState({
                pageCount: pageCount,
                questionsToPage: this.context.questions.slice(this.state.page*10, this.state.page*10+10),
                itemsCount: this.context.questions.length
            });
        }
    }
    getAnswer(id) {
        var value = _.find(this.context.answers,
            function(a) {
                return a.question == id;
            });
        return value.answer;
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.questions.length > 0) {
            var pageCount = nextProps.questions.length / 10;
            this.setState({
                pageCount: pageCount,
                questionsToPage: nextProps.questions.slice(this.state.page*10, this.state.page*10+10),
                itemsCount: nextProps.questions.length
        });
        }
    }
    handlePageClick(page) {
        this.setState({
            page: page.selected,
            questionsToPage: this.props.questions.slice(page.selected*10, page.selected*10 + 10)
        });
    }
    render() {
        return <div className="questions-container">
                       <div style={{fontSize:24}}>{I18n.t("questionsCount")  + " " + this.state.itemsCount}</div>

                   <div className="questions">
                       {this.state.questionsToPage.map((question, key) => (
                          
                           <Question question={question} key={key} questionNumber={this.state.page*10 + key + 1}/>
                       ))}
                   </div>
                   <div className="pagination-block">
                       <ReactPaginate previousLabel={"<"}
                                      nextLabel={">"}
                                      breakLabel={<a href="">...</a>}
                                      breakClassName={"break-me"}
                                      pageCount={this.state.pageCount}
                                      marginPagesDisplayed={2}
                                      pageRangeDisplayed={5}
                                      onPageChange={this.handlePageClick}
                                      containerClassName={"pagination"}
                                      subContainerClassName={"pages pagination"}
                                      activeClassName={"active"}/>
                   </div>
               </div>;
    }
   
    }

Questions.contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    questions: PropTypes.array,
    myActions: PropTypes.object,
    answers:PropTypes.array
};
Questions.propTypes = {
    answers: PropTypes.array,
    questions: PropTypes.array
};
function mapStateToProps(state) {
    return {
        questions: state.contentReducer.questions,
        answers: state.contentReducer.answers
    }
}

function mapDispatchToProps(dispatch) {return {
    myActions: bindActionCreators(actions, dispatch)
}}
export default connect(mapStateToProps, mapDispatchToProps)(Questions);

