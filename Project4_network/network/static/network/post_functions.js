function likePostControl(post) {
    // render like buttons (like number control)
    const element = post.querySelector(".like-btn");
    const element_id = parseInt(element.id.substring(9));
    const type = "post";
    const class_outline = `btn btn-sm btn-outline-primary like-btn ${type}-hide-when-edit-${element_id}`;
    const class_non_outline = `btn btn-sm btn-primary like-btn ${type}-hide-when-edit-${element_id}`;

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
        });
    });

    // const element = post.querySelector(".like-btn");
    // handle like post
    element.addEventListener('click', (event) => {
        // const element_id = parseInt(element.id.substring(9));
        const type = "post";
        const class_outline = `btn btn-sm btn-outline-primary like-btn ${type}-hide-when-edit-${element_id}`;
        const class_non_outline = "btn btn-sm btn-primary like-btn";
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

function commentPostControl(post) {
    // hide all comments
    // post.querySelectorAll(".commentblock").forEach(commentblock => {
    //     commentblock.style.display = "none";
    // });
    var commentblock = post.querySelector(".commentblock");
    commentblock.style.display = "none";
    const element = post.querySelector(".comment-btn");
    element.addEventListener('click', (event) => {
        const post_id = parseInt(element.id.substring(12));
        commentblock = document.querySelector(`#commentblock-${post_id}`);
        
        if (element.classList.contains('btn-outline-primary')) {
            commentblock.style.display = "block";
            element.className = `btn btn-sm btn-primary comment-btn`;
            element.innerHTML = "▲ Comment";
        } else if(element.classList.contains('btn-primary')) {
            commentblock.style.display = "none";
            element.className = `btn btn-sm btn-outline-primary comment-btn`;
            element.innerHTML = "▼ Comment";
        }
    });
}

function editPostControl(post) {
    // hide edit part
    post.querySelectorAll(".edittext").forEach(block => {
        block.style.display = "none";
    })
    const element = post.querySelector('.edit-btn');
    if(element) {
        element.addEventListener('click', (event) => {
            const element_id = parseInt(element.id.substring(9));
            const type = "post";
            element.style.display = "none";

            const hides = post.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
            hides.forEach(hide => {hide.style.display = "none"});

            var comment_btn = post.querySelector(`#comment-btn-${element_id}`);
            var editing_comment_btn = post.querySelector(`#editing-comment-btn-${element_id}`);
            editing_comment_btn.append(comment_btn);

            const show  = post.querySelector(`.${type}-show-when-edit-${element_id}`);
            show.style.display = "block";
        });
    }
}

function cancelEditPostControl(post) {
    const element = post.querySelector('.edit-cancel-btn');
    element.addEventListener('click', (event) => {
        const element_id = parseInt(element.id.substring(21));
        const type = "post";

        const hide  = post.querySelector(`.${type}-show-when-edit-${element_id}`);
        hide.style.display = "none";

        const comment_btn = post.querySelector(`.comment-btn`);
        const comment_btn_span = post.querySelector(`#comment-btn-span-${element_id}`);
        comment_btn_span.append(comment_btn);

        const shows = post.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
        shows.forEach(hide => {hide.style.display = "block"});
    });
}


