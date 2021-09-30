document.addEventListener('DOMContentLoaded', function() {
    renderNewPostSection();
    newPostControl();

    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl_unauth(post)
        resetState_commentPostControl(post);
        editPostControl(post);
    });

    document.querySelectorAll(".commentwrap").forEach((comment) => {
        likeCommentControl_unauth(comment);
    });

});