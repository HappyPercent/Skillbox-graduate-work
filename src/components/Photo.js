import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { likePhoto, unLikePhoto } from '../actions/actions';
import { likePhotoUnsplash, unLikePhotoUnsplash, downoalPhotoFromUnsplash } from '../unsplashAPI/index';

import like from "../images/like.svg";
import download from "../images/download.svg";

class Photo extends React.Component {
    
    constructor (props) {
        super(props);
    }

    toggleLike() {
        const token = localStorage.getItem('token');
        const id = this.props.id;

        if (this.props.photo.liked_by_user) {
            unLikePhotoUnsplash(id, token);
            this.props.unLikePhoto(id);
        } else {
            likePhotoUnsplash(id, token);
            this.props.likePhoto(id);
        }
    }

    downloadPhoto() {
        const token = localStorage.getItem('token');
        const id = this.props.id;
        const downloadURL = this.props.photo.links.download_location;

        downoalPhotoFromUnsplash(id, token, downloadURL);

    }

    render() {
        const user = this.props.photo.user;
        const likeBGImage = {
            backgroundImage: 'url('+ like +')'
        };
        const downloadBGImage = {
            backgroundImage: 'url('+ download +')'
        };

        return (
            <div className='img_wrapper'>
                <img className='photo' src={ this.props.photo.urls.small }></img>
                <div className='overlay'>
                    <Link to={'/auth/' + this.props.id} className='link'></Link>
                    <div className='overlay__top'>
                        <a className='author-info' href={ user.links.html }>
                            <img className='author-info__image' src={ user.profile_image.medium }></img>
                            <span className='author-info__name'>{ user.first_name }</span>
                        </a>
                        <div className='overlay__like-wrapper'>
                            <span className='overlay__like-number'> { this.props.photo.likes } </span>
                            <div className={this.props.photo.liked_by_user ? 'overlay__like-img active' : 'overlay__like-img'} style={ likeBGImage } onClick={ this.toggleLike.bind(this) }></div>
                        </div>
                    </div>
                    <div className='overlay__bottom'>
                        <div className='overlay__created'/>
                        <button className='overlay__download-button' style={ downloadBGImage } onClick={ this.downloadPhoto.bind(this) }></button>
                    </div>
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        photos: state,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        likePhoto: (id) => dispatch(likePhoto(id)),
        unLikePhoto: (id) => dispatch(unLikePhoto(id)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Photo);