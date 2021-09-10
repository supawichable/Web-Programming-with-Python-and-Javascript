document.addEventListener('DOMContentLoaded', function() {
    const newpost = document.querySelector("#newpost");
    newpost.style.display = "none";

    document.querySelectorAll(".commentblock").forEach(commentblock => {
        commentblock.style.display = "none";
    });

    document.querySelectorAll(".edittext").forEach(block => {
        block.style.display = "none";
    })

    const like_btns = document.querySelectorAll(".like-btn");
    like_btns.forEach(like_btn => {
        var element_id, type, class_outline, class_non_outline;
        if (like_btn.classList.contains('comment-like-btn')) {
            element_id = parseInt(like_btn.id.substring(17));
            type = "comment";
            class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
            class_non_outline = `btn btn-sm btn-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
        } else {
            element_id = parseInt(like_btn.id.substring(9));
            type = "post";
            class_outline = `btn btn-sm btn-outline-primary like-btn ${type}-hide-when-edit-${element_id}`;
            class_non_outline = `btn btn-sm btn-primary like-btn ${type}-hide-when-edit-${element_id}`;
        }

        fetch(`/${type}s/${element_id}`)
        .then(response => response.json())
        .then(element_obj => {
            update_likes(element_id, like_btn, type);

            fetch("/user/")
            .then(response => response.json())
            .then(user => {
                if (element_obj.liked_by.includes(user.username)) {
                    like_btn.className = class_non_outline;
                } else {
                    like_btn.className = class_outline;
                }
            });
        });
    });
});

document.addEventListener('click', event => {
    
    const element = event.target;
    // console.log(element.className)

    // show or hide section for adding a new post
    if (element.id === 'newpost-btn'){
        const newpost = document.querySelector("#newpost");
        const newpost_btn = document.querySelector("#newpost-btn");
        if (newpost.style.display === "none") {
            newpost.style.display = "block";
            newpost_btn.className = "btn btn-primary";
            newpost_btn.innerHTML = "▲ New Post";
        } else {
            newpost.style.display = "none";
            newpost_btn.className = "btn btn-outline-primary";
            newpost_btn.innerHTML = "▼ New Post";
        }
    }

    // like buttons handling
    if (element.classList.contains('like-btn')){
        // get post's id
        var element_id, type, class_outline, class_non_outline;
        if (element.classList.contains('comment-like-btn')) {
            element_id = parseInt(element.id.substring(17));
            type = "comment";
            class_outline = `btn btn-sm btn-outline-primary comment-like-btn like-btn ${type}-hide-when-edit-${element_id}`;
            class_non_outline = "btn btn-sm btn-primary comment-like-btn like-btn";
        } else {
            element_id = parseInt(element.id.substring(9));
            type = "post";
            class_outline = `btn btn-sm btn-outline-primary like-btn ${type}-hide-when-edit-${element_id}`;
            class_non_outline = "btn btn-sm btn-primary like-btn";
        }

        if (element.classList.contains('btn-outline-primary')) {
            like(element_id, type);
            element.className = class_non_outline;
        } else if (element.classList.contains('btn-primary')) {
            unlike(element_id, type);
            element.className = class_outline;
        }
        setTimeout(function(){ update_likes(element_id, element, type); }, 100);
    }


    if (element.classList.contains('comment-btn')){
        // get post's id
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
    }

    if (element.classList.contains('edit-btn') && element.classList.contains('btn-outline-primary')) {
        var element_id, type, row_number;
        if (element.classList.contains('comment-edit-btn')) {
            element_id = parseInt(element.id.substring(17));
            type = "comment";
        } else {
            element_id = parseInt(element.id.substring(9));
            type = "post";
        }

        // element.className = `btn btn-sm btn-primary ${type}-edit-btn edit-btn`;
        element.style.display = "none";

        const hides = document.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
        hides.forEach(hide => {hide.style.display = "none"});

        const show  = document.querySelector(`.${type}-show-when-edit-${element_id}`);
        show.style.display = "block";
        // shows.forEach(show => {show.style.display = "block"});

        // const btns = document.getElementById(`${type}-btns-${element_id}`);
        // const cancel_btn = document.createElement('button');
        // cancel_btn.className = "btn btn-sm btn-outline-primary edit-cancel-btn";
        // cancel_btn.id = `${type}-cancel-btn-${element_id}`;
        // cancel_btn.innerHTML = "Cancel";
        // btns.append(cancel_btn);

        // const edittext = document.getElementById(`${type}-edittext-${element_id}`);
        // const editarea = document.createElement('textarea');
        // editarea.className = `form-control form-edit${type}-text`;
        // editarea.rows = row_number;
        // editarea.innerHTML = document.getElementById(`${type}-text-${element_id}`).innerHTML.trim();
        // edittext.append(editarea);

        // const editsubmit = document.getElementById(`${type}-edit-submit-${element_id}`);
        // const submit_btn = document.createElement('button');
        // submit_btn.className = `btn btn-sm btn-primary edit-submit-btn ${type}-edit-submit-btn`;
        // submit_btn.id = `${type}-edit-submit-btn-${element_id}`;
        // submit_btn.innerHTML = "Submit";
        // editsubmit.append(submit_btn);
    }

    if (element.classList.contains('edit-cancel-btn')) {
        var element_id, type, row_number;
        if (element.classList.contains('post')) {
            element_id = parseInt(element.id.substring(21));
            type = "post";
        } else {
            element_id = parseInt(element.id.substring(24));
            type = "comment";
        }

        const hide  = document.querySelector(`.${type}-show-when-edit-${element_id}`);
        hide.style.display = "none";

        const shows = document.querySelectorAll(`.${type}-hide-when-edit-${element_id}`);
        shows.forEach(hide => {hide.style.display = "block"});
        // comment_btn.style.display = "block";

        // const edit_btn = document.getElementById(`${type}-edit-btn-${element_id}`);
        // const like_comment_edit_btn = document.getElementById(`comment-btns-${element_id}`);
        // like_comment_edit_btn.append(edit_btn);
        
        // edit_btn.style.display = "block";
    }
    // if (element.classList.contains("edit-submit-btn")) {
    //     var element_id, type;
    //     if (element.classList.contains("comment-edit-submit-btn")){
    //         element_id = parseInt(element.id.substring(24));
    //         type = "comment";
    //     } else {
    //         element_id = parseInt(element.id.substring(21));
    //         type = "post";
    //     }

    //     console.log(element_id);

    //     const element_text = document.getElementById(`${type}-edittext-${element_id}`);
    //     console.log("value: ", element_text.value);
        
    //     fetch(`/${type}_interact/${element_id}`, {
    //         method: 'PUT',
    //         body: JSON.stringify({
    //             edittext: element_text.value
    //         })
    //     });

    //     // const btns = document.getElementById(`${type}-btns-${element_id}`);
    //     // btns.style.display = "block";
    //     show_updated_text(element_id, type);

    //     const edittext = document.getElementById(`${type}-edittext-${element_id}`);
    //     edittext.style.display = "none";
    //     const editsubmit = document.getElementById(`${type}-edit-submit-${element_id}`);
    //     editsubmit.style.display = "none";
    //     const editcancel = document.getElementById(`${type}-cancel-btn-${element_id}`);
    //     editcancel.style.display = "none";
    // }
})


function like(element_id, type) {
    // like a post or comment
    // type = "post" or "comment"
    fetch(`/${type}_interact/${element_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            like: true
        })
    });
}

function unlike(element_id, type) {
    // unlike a post or comment
    // type = "post" or "comment"
    fetch(`/${type}_interact/${element_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            like: false
        })
    });
}

function update_likes(element_id, like_btn, type){
    // update a post or comment's like number
    // type = "post" or "comment"
    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element => {
        if (element.likes === 0) {
            like_btn.innerHTML = 'Like';
        } else if (element.likes === 1) {
            like_btn.innerHTML = '1 Like';
        } else {
            like_btn.innerHTML = `${element.likes} Likes`;
        }
    });
}

function show_updated_text(element_id, type){
    // fetch an updated text and show it
    // type = "post" or "comment"
    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element => {
        const text = document.getElementById(`${type}-text-${element_id}`);
        text.innerHTML = element.text;
        text.style.display = "block";
    });
}