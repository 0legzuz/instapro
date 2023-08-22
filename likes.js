import { likes, dislikes} from "./api.js";
import { renderLike } from "./index.js";







export const postsLikes = ({token}) => {
  const likeButtons = document.querySelectorAll(".like-button");

  for (const likeButton of likeButtons) {
    likeButton.addEventListener("click", (event) => {
      
      const id = likeButton.dataset.postId;
     
      (likeButton.dataset.isLiked === "true"
        ? dislikes({ postId: id, token: token })
        : likes({ postId: id, token: token })
      )
        .then(() => {
          renderLike();
        
        })
        .catch((error) => {
          if (error.message === "Ошибка авторизации") {
            console.log("Нет авторизации");
          }
        });

      event.stopPropagation();
    });
  }
};
