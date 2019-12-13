const reducer = (state = [], action) => {
    switch(action.type) {
        case "LOAD_PHOTOS":
            return [
                ...state, ...action.photos,
            ]
        case "SEARCH":
            console.log(action.photos);
            return [
                ...action.photos,
            ]
        case "LIKE_PHOTO":
            return state.map((photo, i) => {
                if(photo.id === action.id) {
                    photo.likes = photo.likes + 1;
                    photo.liked_by_user = !photo.liked_by_user;
                    return photo;
                } 
                return photo;
            })
        case "UNLIKE_PHOTO":
            return state.map((photo, i) => {
                if(photo.id === action.id) {
                    photo.likes = photo.likes - 1;
                    photo.liked_by_user = !photo.liked_by_user;
                    return photo;
                }
                return photo;
            })

        default:
            return state;
    }
};

export default reducer;