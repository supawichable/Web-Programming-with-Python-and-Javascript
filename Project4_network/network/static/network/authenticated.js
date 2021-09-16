document.addEventListener('DOMContentLoaded', function() {
    renderNewPostSection();
    newPostControl();

    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl(post);
        commentPostControl(post);
        editPostControl(post);
        cancelEditPostControl(post);
        removePostControl(post);
    });

    document.querySelectorAll(".commentwrap").forEach((comment) => {
        likeCommentControl(comment);
        editCommentControl(comment);
        cancelEditCommentControl(comment);
    });

});