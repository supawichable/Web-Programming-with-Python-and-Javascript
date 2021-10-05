function likeCommentControl(comment) {
    /*
    renders like number for each comment, 
    implements listerner for comments' like buttons
    */

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

    // handle like post
    element.addEventListener('click', (event) => {
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
    /*
    handle like number and like buttons for not logged in session 
    will redirect to log in page if a like button is clicked
    */

    // render like buttons (like number control)
    const element = comment.querySelector(".like-btn");
    const element_id = parseInt(element.id.substring(17));
    const type = "comment";
    const class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;

    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element_obj => {
        update_likes(element_id, element, type);
        element.className = class_outline;
    });

    // handle like post (redirect to login page)
    element.addEventListener('click', (event) => {
        location.href = "../login";
    });
}

function editCommentControl(comment) {
    /*
    handle edit parts (hide when not being edited, show when edit button is clicked)
    implements listener for comments' edit buttons
    */
    
    // hide edit parts
    comment.querySelectorAll(".edittext").forEach(block => {
        block.style.display = "none";
    })

    // handle edit button
    const element = comment.querySelector('.comment-edit-btn');
    if(element) {
        element.addEventListener('click', (event) => {
            const element_id = parseInt(element.id.substring(17));

            // show editting tool (text area & add photo)
            const show = comment.querySelector(`.comment-show-when-edit-${element_id}`);
            show.style.display = "block";

            // clear buffer from the last uncommited edit (edit but did not submit)
            const preview_img = comment.querySelector('.comment-img-wrap');
            if (preview_img.querySelector('img')){
                preview_img.querySelector('img').click();
            }

            // show existing image as default
            if (comment.querySelector('.comment-img')){
                const comment_img = comment.querySelector('.comment-img');
                const img = document.createElement('img');
                img.src = `${comment_img.src}`;
                img.classList = "comment-img-preview";
                preview_img.append(img);
            }

            // hide displaying elements
            const hides = comment.querySelectorAll(`.comment-hide-when-edit-${element_id}`);
            hides.forEach(hide => {hide.style.display = "none"});
        });
    }
}

function submitEditCommentControl(comment) {
    /*
    handle front end when comment editing's submit button is clicked
    update the edited comment's  with new text and image
    */
    const form = comment.querySelector('.form-editcomment');
    const element = comment.querySelector('.comment-edit-submit-btn'); //submit button
    if(form){
        form.addEventListener('submit', (event) => {
            const element_id = parseInt(element.id.substring(24));

            // update the comment's text
            var comment_text = comment.querySelector(`#comment-text-${element_id}`);
            const edited_text = comment.querySelector('.form-editcomment-text');
            comment_text.innerHTML = edited_text.value;
            var comment_img = comment.querySelector('.comment-img');

            // update the comment's image
            const commenttext_img_wrap = comment.querySelector('.commenttext-img-wrap');
            const edited_img = comment.querySelector('.recently-added');
            const preview_img = comment.querySelector('.comment-preview-img');
            
            // if there's an image in preview section, shows it in display section
            if (preview_img) {
                // if there's no existing image in the comment, create a new img element
                if (!comment_img) {
                    var comment_img = document.createElement("img");
                    comment_img.classList = `comment-img comment-hide-when-edit-${element_id}`;
                }
                comment_img.src = edited_img.src;
                commenttext_img_wrap.append(comment_img);
            // if there's an existing image in the comment but no image in the preview section now (i.e. the user has deleted the image),
            // delete the image in the display section
            } else {
                if(comment_img) {
                    commenttext_img_wrap.innerHTML = "";
                }
            }

            const hide  = comment.querySelector(`.comment-show-when-edit-${element_id}`);
            hide.style.display = "none";
    
            const shows = comment.querySelectorAll(`.comment-hide-when-edit-${element_id}`);
            shows.forEach(hide => {hide.style.display = "block"});
        })
    }
}

function cancelEditCommentControl(comment) {
    /*
    handle front end when comment editing's cancel button is clicked
    hides all edit parts, and turn everything back to display parts
    ignore all changes being made in this session of editing
    */
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
    /*
    handle comments' removal and remove buttons
    */
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