import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { likePhoto, unLikePhoto } from '../actions/actions';
import { likePhotoUnsplash, unLikePhotoUnsplash } from '../unsplashAPI/index';

import like from "../images/likered.svg";

class SinglePhoto extends React.Component {

    constructor(props) {
        super(props);
        const photoID = location.pathname.split('auth/')[1];
        let photoInfo = {};
        props.photos.forEach(element => {
            if(element.id === photoID) {
                photoInfo = element;
            }
        });
        this.state = {
            photoInfo: photoInfo,
        };
    };

    componentDidMount() {
        document.body.style.overflow = 'hidden';
    };

    componentWillUnmount() {
        document.body.style.overflow = 'visible';
    };

    UNSAFE_componentWillReceiveProps() {
        this.changePhotoInfo();
    }

    changePhotoInfo() {
        const photoID = location.pathname.split('auth/')[1];
        let photoInfo = {};
        this.props.photos.forEach(element => {
            if(element.id === photoID) {
                photoInfo = element;
            }
        });
        this.setState({photoInfo})
    }

    toggleLike() {
        const token = localStorage.getItem('token');
        const id = this.state.photoInfo.id;

        if (this.state.photoInfo.liked_by_user) {
            unLikePhotoUnsplash(id, token);
            this.props.unLikePhoto(id);
        } else {
            likePhotoUnsplash(id, token);
            this.props.likePhoto(id);
        }
    }

    render() {

        try {
            const likeBGImage = {
                backgroundImage: 'url('+ like +')'
            };
            const user = this.state.photoInfo.user;
            const nextPhotoLink = this.state.photoInfo.number + 1 > this.props.photos.length - 1 ? '#' : '/auth/' + this.props.photos[this.state.photoInfo.number + 1].id
            const prevPhotoLink = this.state.photoInfo.number - 1 < 0 ? '/auth' : '/auth/' + this.props.photos[this.state.photoInfo.number - 1].id
    
            return (
                <div className='overlay__global'>
                    <Link to='/auth' className='overlay__link'></Link>
                    <div className='image-full__wrapper'>
                        <Link to={prevPhotoLink} className='nav-link'></Link>
                        <div className='image-full__top'>
                            <a className='author-info author-info--full-image' href={ user.links.html }>
                                <img className='author-info__image' src={ user.profile_image.medium }></img>
                                <span className='author-info__name author-info__name--black'>{ user.first_name }</span>
                            </a>
                            <div className='overlay__like-wrapper'>
                                <span className='overlay__like-number overlay__like-number--black'> { this.state.photoInfo.likes } </span>
                                <div className={this.state.photoInfo.liked_by_user ? 'active overlay__like-img' : 'overlay__like-img'} style={ likeBGImage } onClick={ this.toggleLike.bind(this) }></div>
                                <button className='image-full__download-button'>Download</button>
                            </div>
                        </div>
                        <div className='centeredBlock'>
                            <img className='image_full' src={ this.state.photoInfo.urls.full }></img>
                        </div>
                        <Link to={nextPhotoLink} className='nav-link nav-link--next'></Link>
                    </div>
                </div>
            );
        } catch (error) {
            return(<Redirect to='/auth'/>)
        }
 
    }
};

function mapStateToProps(state) {
    return {
        photos: state.map((photo, i) => {
            photo.number = i;
            return photo;
        })
    }
};

function mapDispatchToProps(dispatch) {
    return {
        likePhoto: (id) => dispatch(likePhoto(id)),
        unLikePhoto: (id) => dispatch(unLikePhoto(id)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(SinglePhoto);