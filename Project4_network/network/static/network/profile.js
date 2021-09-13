document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl(post);
        commentPostControl(post);
        editPostControl(post);
        cancelEditPostControl(post);
    });

    document.querySelectorAll(".commentwrap").forEach((comment) => {
        likeCommentControl(comment);
        editCommentControl(comment);
        cancelEditCommentControl(comment);
    });

});