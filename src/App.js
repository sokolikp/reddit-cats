import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import _ from 'lodash';
import { connect } from "react-redux";
import { savePost } from "./actions/index";
import { unsavePost } from "./actions/index";

const mapStateToProps = state => {
  return { savedPosts: state.savedPosts };
};

const mapDispatchToProps = dispatch => {
  return {
    savePost: post => dispatch(savePost(post)),
    unsavePost: post => dispatch(unsavePost(post))
  };
};

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            savedPosts: [],
            savedPostMap: {},
            baseUrl: 'https://reddit.com'
        };
    }

    componentDidMount () {
        axios.get('https://www.reddit.com/r/cats/top/.json?count=20')
        .then((response) => {
            const posts = _.map(response.data.data.children, (content) => {
                return {
                    id: content.data.id,
                    title: content.data.title,
                    thumbnail: content.data.thumbnail,
                    height: content.data.thumbnail_height,
                    width: content.data.thumbnail_width,
                    permalink: content.data.permalink
                };
            });

            this.setState({ posts: posts });
        });
    }

    onClickSave (event, post) {
        const savedPost = _.find(this.props.savedPosts, { id: post.id });
        if (!savedPost) {
            this.props.savePost(post);
        } else {
            this.props.unsavePost(post);
        }
    }

    getPostItem (post, i, isSaved) {
        return (
            <div key={post.id} className="post-row">
                <div className="post-row__count">{i + 1}</div>
                <div className="post-row__save" onClick={(e) => this.onClickSave(e, post)}>
                    <i className={(isSaved ? 'fas' : 'far') + ' fa-bookmark'}></i>
                </div>
                <a  className="post-row__thumb-container" href={this.state.baseUrl + post.permalink} target="_blank">
                    <img className="post-row__thumb" src={post.thumbnail} alt=""/>
                </a>
                <a href={this.state.baseUrl + post.permalink} target="_blank">{post.title}</a>
            </div>
        )
    }

    render() {
        const savedPostIds = _.map(this.props.savedPosts, 'id');
        const unsavedPosts = _.filter(this.state.posts, (post) => {
            return _.indexOf(savedPostIds, post.id) < 0;
        });

        const savedPostItems = _.map(this.props.savedPosts, (post, i) => {
            return this.getPostItem(post, i, true);
        });
        const unsavedPostItems = _.map(unsavedPosts, (post, i) => {
            return this.getPostItem(post, i + savedPostItems.length, false);
        });

        return (
          <div className="app">
            <div className="app-header">
                <span className="app-title">
                    Reddit Cats
                </span>
            </div>
            {savedPostItems.length ?
            <div className="posts-container--saved">
                <div className="posts-container__header">Saved posts</div>
                <div>{savedPostItems}</div>
            </div> : null}


            <div className="posts-container--main">
                <div className="posts-container__header"></div>
                <div>{unsavedPostItems}</div>
            </div>

          </div>
        );
    }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default ConnectedApp;
