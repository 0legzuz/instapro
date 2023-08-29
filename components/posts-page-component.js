import { USER_POSTS_PAGE } from '../routes.js';
import { renderHeaderComponent } from './header-component.js';
import { posts, goToPage } from '../index.js';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function renderPostsPageComponent({ appEl }) {
    /**
     * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */
    //Обертка каждого поста

    const appHtml = posts
        .map((post) => {
            let likeIcon = post.isLiked
                ? './assets/images/like-active.svg'
                : './assets/images/like-not-active.svg';

            let likeCounter = '';

            if (post.likes.length === 0) {
                likeCounter = post.likes.length;
            } else if (post.likes.length === 1) {
                likeCounter = post.likes[0].name;
            } else {
                likeCounter = `${
                    post.likes[Math.floor(Math.random() * post.likes.length)]
                        .name
                } и еще ${post.likes.length - 1}`;
            }

            return `<li class="post">
                    <div class="post-header" data-user-id='${post.user.id}'>
                        <img src="${
                            post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" data-is-liked="${
                          post.isLiked
                      }" class="like-button">
                        <img src="${likeIcon}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: ${likeCounter}
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                       ${post.description}
                      
                    </p>
                    <p class="post-date">
                      ${formatDistanceToNow(parseISO(post.createdAt), {
                          locale: ru,
                          addSuffix: true,
                      })}
                    </p>
                  </li>`;
        })
        .join('');
    // Обертка контейнера постов
    appEl.innerHTML = `
               <div class="page-container">
                <div class="header-container"></div>

                

                 <ul class="posts">${appHtml}</ul>
               </div>`;

    //Отрисовка шапки
    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    });
    // Что-то странное
    // renderHeaderComponent;
    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            });
        });
    }
}
