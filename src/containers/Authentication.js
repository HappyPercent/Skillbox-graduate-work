import React from 'react';
import { connect } from 'react-redux';

import { loadPhotosAction, searchPhotosAction } from '../actions/actions';
import { userAccessToken, getListPhotos, searchPhotos } from '../unsplashAPI';

import Photo from '../components/Photo';
import Masonry from 'masonry-layout';

let firstPageLoad = true;

class Authentication extends React.Component {
    
    constructor(props) {
        super();
        this.loadPhotos = this.loadPhotos.bind(this);

        if(!localStorage.getItem('token')) {
            userAccessToken(location.search.split('code=')[1]);
        }

        this.state = {
            search: '',
        }
    }

    componentDidMount() {
        if (firstPageLoad) {
            this.loadPhotos();
            firstPageLoad = false;
        }

        window.addEventListener('scroll', this.onScroll.bind(this), true);
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
            this.loadPhotos();
        }
    }

    searchHandler(ev) {
        if(ev.keyCode === 13) {
            ev.preventDefault();
            const page = localStorage.getItem('page');
            const perPage = localStorage.getItem('perPage');
            const keyword = this.state.search;
            const token = localStorage.getItem('token');

            // searchPhotosAction();

            searchPhotos(keyword, page, perPage, token)
                .then((photos) => searchPhotosAction(photos));
        }
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
        searchPhotosAction: (photos) => dispatch(searchPhotosAction(photos)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication);