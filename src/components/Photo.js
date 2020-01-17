import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { likePhoto, unLikePhoto } from '../actions/actions';
import { likePhotoUnsplash, unLikePhotoUnsplash, downoalPhotoFromUnsplash } from '../unsplashAPI/index';

import like from "../images/like.svg";
import download from "../images/download.svg";

import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

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

    componentDidMount() {
        let msnry = new Masonry( '.image_container', {
            itemSelector: '.img_wrapper',
            columnWidth: '.img_wrapper',
            percentPosition: true,
        });

        imagesLoaded(document.querySelector('.image_container'), function() {
            msnry.layout();
        });
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