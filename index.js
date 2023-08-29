import { getPosts, getUserPosts, addPost } from './api.js';
import { renderAddPostPageComponent } from './components/add-post-page-component.js';
import { renderAuthPageComponent } from './components/auth-page-component.js';
import {
    ADD_POSTS_PAGE,
    AUTH_PAGE,
    LOADING_PAGE,
    POSTS_PAGE,
    USER_POSTS_PAGE,
} from './routes.js';
import { renderPostsPageComponent } from './components/posts-page-component.js';
import { renderLoadingPageComponent } from './components/loading-page-component.js';
import {
    getUserFromLocalStorage,
    removeUserFromLocalStorage,
    saveUserToLocalStorage,
} from './helpers.js';
import { postsLikes } from './likes.js';

export let user = getUserFromLocalStorage();
export let page = null;
export let posts = [];

// Получение токена
export const getToken = () => {
    const token = user ? `Bearer ${user.token}` : undefined;
    return token;
};

// Выход из авторизованного окна
export const logout = () => {
    user = null;
    removeUserFromLocalStorage();
    goToPage(POSTS_PAGE);
};

// Включение страницы приложения

export const goToPage = (newPage, data) => {
    if (
        [
            POSTS_PAGE,
            AUTH_PAGE,
            ADD_POSTS_PAGE,
            USER_POSTS_PAGE,
            LOADING_PAGE,
        ].includes(newPage)
    ) {
        if (newPage === ADD_POSTS_PAGE) {
            // Если пользователь не авторизован, то отправляем его на авторизацию перед добавлением поста
            page = user ? ADD_POSTS_PAGE : AUTH_PAGE;
            return renderApp();
        }

        if (newPage === POSTS_PAGE) {
            page = LOADING_PAGE;
            renderApp();

            return getPosts({ token: getToken() })
                .then((newPosts) => {
                    page = POSTS_PAGE;
                    posts = newPosts;
                    renderApp();
                    postsLikes({ token: getToken() });
                })
                .catch((error) => {
                    console.error(error);
                    goToPage(POSTS_PAGE);
                });
        }

        if (newPage === USER_POSTS_PAGE) {
            page = LOADING_PAGE;
            renderApp();
            // TODO: реализовать получение постов юзера из API

            return getUserPosts({ token: getToken(), id: data.userId })
                .then((newPosts) => {
                    posts = newPosts;
                    page = USER_POSTS_PAGE;
                    renderApp();
                    postsLikes({ token: getToken() });
                })
                .catch((error) => {
                    console.error(error);
                    goToPage(POSTS_PAGE);
                });
        }

        page = newPage;
        renderApp();

        return;
    }

    throw new Error('страницы не существует');
};

export const renderApp = () => {
    const appEl = document.getElementById('app');
    if (page === LOADING_PAGE) {
        return renderLoadingPageComponent({
            appEl,
            user,
            goToPage,
        });
    }

    if (page === AUTH_PAGE) {
        return renderAuthPageComponent({
            appEl,
            setUser: (newUser) => {
                user = newUser;
                saveUserToLocalStorage(user);
                goToPage(POSTS_PAGE);
            },
            user,
            goToPage,
        });
    }

    if (page === ADD_POSTS_PAGE) {
        return renderAddPostPageComponent({
            appEl,
            onAddPostClick({ description, imageUrl }) {
                addPost({ description, imageUrl, token: getToken() }).then(
                    () => {
                        goToPage(POSTS_PAGE);
                    },
                );
            },
        });
    }

    if (page === POSTS_PAGE) {
        renderPostsPageComponent({ appEl });
    }

    if (page === USER_POSTS_PAGE) {
        renderPostsPageComponent({ appEl });
        const headerContainer = document.querySelector('.header-container');

        headerContainer.insertAdjacentHTML(
            'afterend',
            ` <div class="posts-user-header">
                  <img src="${posts[0].user.imageUrl}" class="posts-user-header__user-image">
                  <p class="posts-user-header__user-name"> ${posts[0].user.name} </p>
                </div>`,
        );

        const postHeaders = document.querySelectorAll('.post-header');

        for (const postHeader of postHeaders) {
            postHeader.style.display = 'none';
        }
    }
};

export const renderLike = () => {
    getPosts({ token: getToken() }).then((newPosts) => {
        posts = newPosts;
        renderApp();
        postsLikes({ token: getToken() });
    });

    return;
};

goToPage(POSTS_PAGE);
