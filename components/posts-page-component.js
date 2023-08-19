import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";
import { sanitizeHtml } from "/sanitizeHTML.js";




export function renderPostsPageComponent({ appEl }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */








    const appHtml = posts
      .map((post) => {
        let likeIcon = post.isLiked
          ? "./assets/images/like-active.svg"
          : "./assets/images/like-not-active.svg";

        return `<li class="post">
                    <div class="post-header" data-user-id='${post.id}'>
                        <img src="${
                          post.user.imageUrl
                        }" class="post-header__user-image">
                        <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="${post.imageUrl}">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="${post.id}" class="like-button">
                        <img src="${likeIcon}">
                      </button>
                      <p class="post-likes-text">
                        Нравится: ${post.likes.length}
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">${post.user.name}</span>
                       ${sanitizeHtml(post.description)}
                      
                    </p>
                    <p class="post-date">
                      ${post.createdAt}
                    </p>
                  </li>`;
      })
      .join("");

  appEl.innerHTML = `
               <div class="page-container">
                 <div class="header-container"></div>
                 <ul class="posts">${appHtml}</ul>
               </div>`;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
renderHeaderComponent;
  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
