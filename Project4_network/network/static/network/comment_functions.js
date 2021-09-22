function likeCommentControl(comment) {
    // render like buttons (like number control)
    const element = comment.querySelector(".like-btn");
    const element_id = parseInt(element.id.substring(17));
    const type = "comment";
    const class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
    const class_non_outline = `btn btn-sm btn-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;

    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element_obj => {
        update_likes(element_id, element, type);

        fetch("/user/")
        .then(response => response.json())
        .then(user => {
            if (element_obj.liked_by.includes(user.username)) {
                element.className = class_non_outline;
            } else {
                element.className = class_outline;
            }
        })
        .catch(error => {
            console.log("user not logged in");
        })
    });

    // const element = post.querySelector(".like-btn");
    // handle like post
    element.addEventListener('click', (event) => {
        // const element_id = parseInt(element.id.substring(17));
        const type = "comment";
        const class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
        const class_non_outline = "btn btn-sm btn-primary comment-like-btn like-btn";
        if (element.classList.contains('btn-outline-primary')) {
            like(element_id, type);
            element.className = class_non_outline;
        } else if (element.classList.contains('btn-primary')) {
            unlike(element_id, type);
            element.className = class_outline;
        }
        setTimeout(function(){ update_likes(element_id, element, type); }, 100);
    });
}

function likeCommentControl_unauth(comment) {
    // render like buttons (like number control)
    const element = comment.querySelector(".like-btn");
    const element_id = parseInt(element.id.substring(17));
    const type = "comment";
    const class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
    const class_non_outline = `btn btn-sm btn-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;

    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element_obj => {
        update_likes(element_id, element, type);
        element.className = class_outline;
    });

    // const element = post.querySelector(".like-btn");
    // handle like post
    element.addEventListener('click', (event) => {
        // const element_id = parseInt(element.id.substring(17));
        location.href = "login";
    });
}

function editCommentControl(comment) {
    // hide edit part
    comment.querySelectorAll(".edittext").forEach(block => {
        block.style.display = "none";
    })
    const element = comment.querySelector('.edit-btn');
    if(element) {
        element.addEventListener('click', (event) => {
            const element_id = parseInt(element.id.substring(17));
            const type = "comment";
            element.style.display = "none";
    
            const hides = comment.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
            hides.forEach(hide => {hide.style.display = "none"});
    
            const show = comment.querySelector(`.${type}-show-when-edit-${element_id}`);
            show.style.display = "block";
        });
    }
}

function cancelEditCommentControl(comment) {
    const element = comment.querySelector('.edit-cancel-btn')
    if(element) {
        element.addEventListener('click', (event) => {
            const element_id = parseInt(element.id.substring(24));
            const type = "comment";
    
            const hide  = comment.querySelector(`.${type}-show-when-edit-${element_id}`);
            hide.style.display = "none";
    
            const shows = comment.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
            shows.forEach(hide => {hide.style.display = "block"});
        });
    }
}

function removeCommentControl(comment){
    const element = comment.querySelector('.comment-remove-btn');
    if (element) {
        element.addEventListener('click', (event) => {
            comment.remove();
            const element_id = parseInt(element.id.substring(19));
            const csrftoken = getCookie('csrftoken');
            fetch(`/comment_interact/${element_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    remove:true
                }),
                headers: {"X-CSRFToken": csrftoken}
            });
        });
    }
}