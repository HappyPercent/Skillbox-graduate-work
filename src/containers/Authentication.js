import React from 'react';
import { connect } from 'react-redux';

import { loadPhotosAction, firstSearchPhotosAction, secondarySearchPhotosAction } from '../actions/actions';
import { userAccessToken, getListPhotos, searchPhotos } from '../unsplashAPI';

import Photo from '../components/Photo';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';

let firstPageLoad = true;

class Authentication extends React.Component {
    
    constructor() {
        super();
        this.loadPhotos = this.loadPhotos.bind(this);

        if(!localStorage.getItem('token')) {
            userAccessToken(location.search.split('code=')[1]);
        }

        this.state = {
            search: '',
            msnry: [],
            lastSearched: '',
        }
    }

    componentDidMount() {
        if (firstPageLoad) {
            this.loadPhotos();
            firstPageLoad = false;
        }

        window.addEventListener('scroll', this.onScroll.bind(this), true);

        let msnry = new Masonry('.image_container', {
            itemSelector: '.img_wrapper',
            columnWidth: '.img_wrapper',
            percentPosition: true,
        });

        imagesLoaded(document.querySelector('.image_container'), function() {
            msnry.layout();
        });
    }

    componentDidUpdate() {
        let msnry = new Masonry('.image_container', {
            itemSelector: '.img_wrapper',
            columnWidth: '.img_wrapper',
            percentPosition: true,
        });

        imagesLoaded(document.querySelector('.image_container'), function() {
            msnry.layout();
        });
    }

    loadPhotos() {
        let page = localStorage.getItem('page');    
        let perPage = localStorage.getItem('perPage');

        getListPhotos(page, perPage, localStorage.getItem('token'))
            .then(photos => {
                this.props.loadPhotosAction(photos);
            })
            .then(() => {
                localStorage.setItem('loadAvaliableBool', true);
                localStorage.setItem('page', +page + 1);
            });
    }

    onScroll() {
        const loadPhotoScrollBorder = window.innerHeight;
        const spaceToPageBottom = document.querySelector('body').offsetHeight - window.scrollY - window.innerHeight;
        if (loadPhotoScrollBorder > spaceToPageBottom && localStorage.getItem('loadAvaliableBool') == 'true') {
            localStorage.setItem('loadAvaliableBool', false);
            if(this.state.lastSearched === '') {
                this.loadPhotos();
            } else {
                const page = localStorage.getItem('page');
                const perPage = localStorage.getItem('perPage');
                const keyword = this.state.lastSearched;
                const token = localStorage.getItem('token');

                this.loadSearchedPhotos(keyword, page, perPage, token, false)                
            }
        }
    }

    searchHandler(ev) {
        if(ev.keyCode === 13) {
            ev.preventDefault();

            localStorage.setItem('page', 1);
            const page = localStorage.getItem('page');
            const perPage = localStorage.getItem('perPage');
            const keyword = this.state.search;
            const token = localStorage.getItem('token');
            this.state.lastSearched = keyword;

            this.loadSearchedPhotos(keyword, page, perPage, token, true)
        }
    }

    loadSearchedPhotos(keyword, page, perPage, token, firstSearch) {
        searchPhotos(keyword, page, perPage, token)
            .then((photos) => {
                if(firstSearch) {
                    this.props.firstSearchPhotosAction(photos)
                } else {
                    this.props.secondarySearchPhotosAction(photos)
                }
            })
            .then(() => {
                localStorage.setItem('loadAvaliableBool', true);
                localStorage.setItem('page', +page + 1);
            });
    }

    render() {
        return (
            <div className='photos-screen'>
                <header>
                    <div>Skillbox graduate work</div>
                    <input 
                        type='search' 
                        placeholder='Search' 
                        value={ this.state.search }
                        onKeyDown={ ev => this.searchHandler(ev) }
                        onChange={ ev => this.setState({search: ev.target.value}) }></input>
                </header>
                <div className='image_container'>
                {
                    this.props.photos.map((photo, i) => {
                        return <Photo 
                            photo={ photo }
                            key={ i }
                            id={ photo.id }
                            msnry={ this.state.msnry }
                        />
                    })
                }
                </div>
            </div>
        );
    }
};

function mapStateToProps(state) {
    return {
        photos: state
    }
}

function mapDispatchToProps(dispatch) {
    return {
        loadPhotosAction: (photos) => dispatch(loadPhotosAction(photos)),
        firstSearchPhotosAction: (photos) => dispatch(firstSearchPhotosAction(photos)),
        secondarySearchPhotosAction: (photos) => dispatch(secondarySearchPhotosAction(photos)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication);