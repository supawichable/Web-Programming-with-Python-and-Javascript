function likePostControl(post) {
    /*
    renders like number for each post, 
    implements listener for posts' like buttons  
    */

    //render like buttons (like number control)
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
    /*
    handle like number and like buttons for not logged in session 
    will redirect to log in page if a like button is clicked
    */
    
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

    // handle like post (redirect to login page)
    element.addEventListener('click', (event) => {
        location.href = "../login";
    });
}

function saveState_commentPostControl(post) {
    /*
    handle comment buttons and comment sections for each post
    comment section that's being shown would remained shown after page reloading  
    (i.e. after new comment being made, that comment section will be shown after page reload)  
    */

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

    // set comment buttons' initial state
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

    // handle comment button for each post
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
    /*
    handle comment buttons and comment sections for each post
    all comment sections will be reloaded as 'hide' state   
    (i.e. when a page is reloaded by actions other than adding a new comment, all comment sections' state will be 'hidden')  
    */

    // hide all comments
    var commentblock = post.querySelector(".commentblock");
    var comment_btn = post.querySelector(".comment-btn");
    const post_id = parseInt(comment_btn.id.substring(12));

    localStorage.setItem(`comment_btn_status_${post_id}`, 0);
    comment_btn.classList.add('btn-outline-primary');
    comment_btn.innerHTML = "▼ Comment";
    
    var comment_btn_status = parseInt(localStorage.getItem(`comment_btn_status_${post_id}`));

    // set comment buttons' initial state
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

    // handle comment button for each post
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
    /*
    handle edit parts (hide when not being edited, show when edit button is clicked)
    implements listener for posts' edit buttons
    */

    // hide edit parts
    post.querySelectorAll(".edittext").forEach(block => {
        block.style.display = "none";
    })

    // handle edit button
    const element = post.querySelector('.edit-btn');
    if(element) {
        element.addEventListener('click', (event) => {
            const element_id = parseInt(element.id.substring(9));

            const show  = post.querySelector(`.post-show-when-edit-${element_id}`);
            show.style.display = "block";

            // hide all images in preview
            const preview_img = post.querySelector('.post-img-wrap-editpost');
            preview_img.querySelectorAll('img').forEach((img) => {
                img.className="unlisted"
                img.style.display = "none";
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

            const hides = post.querySelectorAll(`.post-hide-when-edit-${element_id}`);
            hides.forEach(hide => {hide.style.display = "none"});

            var comment_btn = post.querySelector(`#comment-btn-${element_id}`);
            var editing_comment_btn = post.querySelector(`#editing-comment-btn-${element_id}`);
            editing_comment_btn.append(comment_btn);

        });
    }
}

function submitEditPostControl(post){
    /*
    handle front end when post editing's submit button is clicked
    update the edited post's  with new text and images
    */

    const form = post.querySelector('.form-editpost');
    const element = post.querySelector('.post-edit-submit-btn'); //submit button
    if (form) {
        form.addEventListener('submit', (event) => {
            const element_id = parseInt(element.id.substring(21));

            // update the post's text
            var post_text = post.querySelector(".posttext");
            const edited_text = post.querySelector(".form-editpost-text");
            var img_container = post.querySelector('.post-img-container');
            post_text.innerHTML = edited_text.value;

            // update the post's images 
            var preview_exists = 0; //check if there's at least one image in preview
            var post_img_wrap = post.querySelector('.post-img-wrap');
            
            // if there's already images in the post, clear the image wrap
            if (post_img_wrap) {
                post_img_wrap.innerHTML = "";
            // if there us not, create a new image wrap
            } else {
                post_img_wrap = document.createElement('div');
                post_img_wrap.classList = `post-img-wrap post-hide-when-edit-${element_id}`;
            }
            // when submit button is clicked, show all images that exist in preview section, in display section
            const preview_img_wrap = post.querySelector('.post-img-wrap-editpost');
            if(preview_img_wrap.querySelector('img')){
                preview_img_wrap.querySelectorAll('img').forEach((img) => {
                    if (img.style.display != "none") {
                        var new_img = document.createElement('img');
                        new_img.src = img.src;
                        new_img.classList = "post-img";
                        post_img_wrap.append(new_img);
                        preview_exists = 1;
                    }
                });
            }
            
            // if image wrap is newly created, append it to the image container of the post
            if (!img_container.querySelector('.post_img_wrap')) {
                img_container.append(post_img_wrap);
            }

            // hide edit parts, show displat parts
            const hide = post.querySelector(`.post-show-when-edit-${element_id}`);
            hide.style.display = "none";

            const shows = post.querySelectorAll(`.post-hide-when-edit-${element_id}`);
            shows.forEach(hide => {hide.style.display = "block"});
            
            // if there's at least one image in the preview section, display them in image wrap as grid
            if (preview_exists === 1) {
                post_img_wrap.style.display = "grid";
            // if not, hide image wrap
            } else {
                post_img_wrap.style.display = "none";
            }

            // display comment button
            const comment_btn = post.querySelector(`.comment-btn`);
            const comment_btn_span = post.querySelector(`#comment-btn-span-${element_id}`);
            comment_btn_span.append(comment_btn);
        });
    }
}


function cancelEditPostControl(post) {
    /*
    handle front end when post editing's cancel button is clicked
    hides all edit parts, and turn everything back to display parts
    ignore all changes being made in this session of editing
    */

    // check if there's at least one image in preview section
    const element = post.querySelector('.edit-cancel-btn');
    element.addEventListener('click', (event) => {
        var preview_exists = 0;
        const preview_img_wrap = post.querySelector('.post-img-wrap-editpost');
        if (preview_img_wrap.querySelector('img')) {
            preview_img_wrap.querySelectorAll('img').forEach((img) => {
                if(img.style.display != "none"){
                    preview_exists = 1;
                }
            });
        }

        const element_id = parseInt(element.id.substring(21));

        const hide  = post.querySelector(`.post-show-when-edit-${element_id}`);
        hide.style.display = "none";

        const comment_btn = post.querySelector('.comment-btn');
        const comment_btn_span = post.querySelector(`#comment-btn-span-${element_id}`);
        comment_btn_span.append(comment_btn);

        const shows = post.querySelectorAll(`.post-hide-when-edit-${element_id}`);
        shows.forEach((hide) => {hide.style.display = "block"});

        const grid = post.querySelector('.post-img-wrap');
        // if there's no image in preview section, hide image wrap
        if (preview_exists === 0) {
            grid.style.display = "none";
        // if there is, displays as grid
        } else {
            grid.style.display = "grid";
        }
    });
}

function index_removePostControl(post) {
    /*
    handle posts' removal and remove buttons for index page
    (shows new post form if the post being removed is the last post left) 
    */
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
            // shows new post form if the post being removed is the last post left
            if (checkpost === null) {
                const newpost_btn = document.querySelector(".btn-outline-primary");
                newpost_btn.click();   
            }
        });
    }
}

function profile_removePostControl(post){
    /*
    handle posts'removal and remove buttons for profile page
    (no need to handle new post form as it does not exist in profile page)
    */
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
