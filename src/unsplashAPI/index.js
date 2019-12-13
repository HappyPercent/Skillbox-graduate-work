import Unsplash, { toJson } from 'unsplash-js';

export const unsplash = new Unsplash({
    accessKey: "7085476b67040ac788a375fd0e53f0e4593b94efa2d2ab4b12db7b2f61ad99ab",
    secret: "9db0133d6c11afd84408f346cf54eb4c89e35588549918f34c0b3465ac3031ca",
    // callbackUrl: "http://localhost:8080/auth",
    callbackUrl: "http://devtestpage.ru/auth",
});

export const authenticationUrl = unsplash.auth.getAuthenticationUrl([
    "public",
    "write_likes"
]);

export const userAccessToken = (OAUTH_CODE) => {
    unsplash.auth.userAuthentication(OAUTH_CODE)
        .then(toJson)
        .then(json => {
            localStorage.setItem('token', json.access_token)
        });
};

export const getListPhotos = (page, perPage, token) => {
    unsplash.auth.setBearerToken(token);

    return unsplash.photos.listPhotos(page, perPage, "latest")
        .then(toJson);
};

export const likePhotoUnsplash = (id, token) => {
    unsplash.auth.setBearerToken(token);

    unsplash.photos.likePhoto(id)
        .then(toJson)
        .then(json => {});
};

export const unLikePhotoUnsplash = (id, token) => {
    unsplash.auth.setBearerToken(token);

    unsplash.photos.unlikePhoto(id)
        .then(toJson)
        .then(json => {});
};

export const downoalPhotoFromUnsplash = (id, token) => {

    unsplash.photos.getPhoto(id)
        .then(toJson)
        .then(json => {
            unsplash.auth.setBearerToken(token);
            unsplash.photos.downloadPhoto(json)
                .then(json => console.log(json));
        });
};

export const searchPhotos = (keyword, page, perPage, token) => {
    unsplash.auth.setBearerToken(token);

    return unsplash.search.photos(keyword, page, perPage)
        .then(toJson);
};