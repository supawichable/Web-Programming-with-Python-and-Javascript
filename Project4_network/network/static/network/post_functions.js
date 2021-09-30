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
    })
    .catch(error => {
        console.log("user not logged in");
    });

    // handle like post
    element.addEventListener('click', (event) => {
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

function likePostControl_unauth(post) {
    // render like buttons (like number control)

    const element = post.querySelector(".like-btn");
    const element_id = parseInt(element.id.substring(9));
    const type = "post";
    const class_outline = `btn btn-sm btn-outline-primary like-btn ${type}-hide-when-edit-${element_id}`;

    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element_obj => {
        update_likes(element_id, element, type);
        element.className = class_outline;
    });

    // handle like post
    element.addEventListener('click', (event) => {
        location.href = "../login";
    });
}

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
        })
        .catch(error => {
            console.log("user not logged in");
        });
    });

    // handle like post
    element.addEventListener('click', (event) => {
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


function saveState_commentPostControl(post) {
    // hide all comments
    var commentblock = post.querySelector(".commentblock");
    var comment_btn = post.querySelector(".comment-btn");
    const post_id = parseInt(comment_btn.id.substring(12));

    if (!localStorage.getItem(`comment_btn_status_${post_id}`)) {
        localStorage.setItem(`comment_btn_status_${post_id}`, 0);
        comment_btn.classList.add('btn-outline-primary');
        comment_btn.innerHTML = "▼ Comment";
    }
    
    var comment_btn_status = parseInt(localStorage.getItem(`comment_btn_status_${post_id}`));

    if (comment_btn_status == 0) {
        comment_btn.classList.add('btn-outline-primary');
        comment_btn.innerHTML = "▼ Comment";
        commentblock.style.display = "none";
    } else {
        comment_btn.click();
        comment_btn.classList.add('btn-primary');
        comment_btn.innerHTML = "▲ Comment";
        commentblock.style.display = "block";
    }

    comment_btn.addEventListener('click', (event) => {
        const post_id = parseInt(comment_btn.id.substring(12));
        commentblock = document.querySelector(`#commentblock-${post_id}`);
        
        if (comment_btn.classList.contains('btn-outline-primary')) {
            commentblock.style.display = "block";
            comment_btn.className = `btn btn-sm btn-primary comment-btn`;
            comment_btn.innerHTML = "▲ Comment";
            localStorage.setItem(`comment_btn_status_${post_id}`, 1);
        } else if(comment_btn.classList.contains('btn-primary')) {
            commentblock.style.display = "none";
            comment_btn.className = `btn btn-sm btn-outline-primary comment-btn`;
            comment_btn.innerHTML = "▼ Comment";
            localStorage.setItem(`comment_btn_status_${post_id}`, 0);
        }
    });
}


function resetState_commentPostControl(post) {
    // hide all comments
    var commentblock = post.querySelector(".commentblock");
    var comment_btn = post.querySelector(".comment-btn");
    const post_id = parseInt(comment_btn.id.substring(12));

    // if (!localStorage.getItem(`comment_btn_status_${post_id}`)) {
    localStorage.setItem(`comment_btn_status_${post_id}`, 0);
    comment_btn.classList.add('btn-outline-primary');
    comment_btn.innerHTML = "▼ Comment";
    // }
    
    var comment_btn_status = parseInt(localStorage.getItem(`comment_btn_status_${post_id}`));

    if (comment_btn_status == 0) {
        comment_btn.classList.add('btn-outline-primary');
        comment_btn.innerHTML = "▼ Comment";
        commentblock.style.display = "none";
    } else {
        comment_btn.click();
        comment_btn.classList.add('btn-primary');
        comment_btn.innerHTML = "▲ Comment";
        commentblock.style.display = "block";
    }

    comment_btn.addEventListener('click', (event) => {
        const post_id = parseInt(comment_btn.id.substring(12));
        commentblock = document.querySelector(`#commentblock-${post_id}`);
        
        if (comment_btn.classList.contains('btn-outline-primary')) {
            commentblock.style.display = "block";
            comment_btn.className = `btn btn-sm btn-primary comment-btn`;
            comment_btn.innerHTML = "▲ Comment";
            localStorage.setItem(`comment_btn_status_${post_id}`, 1);
        } else if(comment_btn.classList.contains('btn-primary')) {
            commentblock.style.display = "none";
            comment_btn.className = `btn btn-sm btn-outline-primary comment-btn`;
            comment_btn.innerHTML = "▼ Comment";
            localStorage.setItem(`comment_btn_status_${post_id}`, 0);
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
            const type = "post";
            const element_id = parseInt(element.id.substring(9));

            const show  = post.querySelector(`.${type}-show-when-edit-${element_id}`);
            show.style.display = "block";

            // hide all images in preview
            const preview_img = post.querySelector('.post-img-wrap-editpost');
            preview_img.querySelectorAll('img').forEach((img) => {
                img.className="unlisted"
                img.style.display = "none";
                // preview_img.remove(img);
            })

            // show all existing images in preview
            const existing_img = post.querySelector('.post-img-wrap');
            if (existing_img) {
                existing_img.querySelectorAll('img').forEach((img) => {
                    const new_img = document.createElement('img');
                    new_img.src = img.src;
                    new_img.className = "post-img-editpost";
                    preview_img.append(new_img);
                });
            }

            photoUpload_editPost(post);

            const hides = post.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
            hides.forEach(hide => {hide.style.display = "none"});

            var comment_btn = post.querySelector(`#comment-btn-${element_id}`);
            var editing_comment_btn = post.querySelector(`#editing-comment-btn-${element_id}`);
            editing_comment_btn.append(comment_btn);

            // const preview_img = post.querySelector('.post-img-wrap-editpost');
            // post.querySelectorAll('.recently-added').forEach((img) =>  {
            //     img.click();
            // });

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
        shows.forEach((hide) => {hide.style.display = "block"});

        const grid = post.querySelector('.post-img-wrap');
        grid.style.display = "grid";
    });
}

function index_removePostControl(post) {
    const element = post.querySelector('.remove-btn');
    if (element) {       
        element.addEventListener('click', (event) => { 
            post.remove();
            const element_id = parseInt(element.id.substring(11));
            const csrftoken = getCookie('csrftoken');
            fetch(`/post_interact/${element_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    remove: true
                }),
                headers: {"X-CSRFToken": csrftoken}
            }); 
            const checkpost = document.querySelector(".postwrap");
            console.log(checkpost);
            if (checkpost === null) {
                const newpost_btn = document.querySelector(".btn-outline-primary");
                newpost_btn.click();   
            }
        });
    }
}

function profile_removePostControl(post){
    const element = post.querySelector('.remove-btn');
    if (element) {       
        element.addEventListener('click', (event) => { 
            post.remove();
            const element_id = parseInt(element.id.substring(11));
            const csrftoken = getCookie('csrftoken');
            fetch(`/post_interact/${element_id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    remove: true
                }),
                headers: {"X-CSRFToken": csrftoken}
            }); 
        });
    }
}
