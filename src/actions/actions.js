export const loadPhotosAction = (photos) => {
    return {
        type: 'LOAD_PHOTOS',
        photos: photos,
        // photos: JSON.parse(localStorage.getItem('photos')),
    } 
};

export const searchPhotosAction = (photos) => {
    return {
        type: 'SEARCH',
        photos: photos,
        // photos: JSON.parse(localStorage.getItem('photos')),
    } 
};

export const likePhoto = (id) => {
    return {
        type: 'LIKE_PHOTO',
        id: id
    } 
};

export const unLikePhoto = (id) => {
    return {
        type: 'UNLIKE_PHOTO',
        id: id
    } 
};