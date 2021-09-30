document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl(post);
        editPostControl(post);
        cancelEditPostControl(post);
    });

    document.querySelectorAll(".newcomment").forEach((newcomment) => {
        photoUpload_addComment(newcomment);
    });

    document.querySelectorAll(".commentwrap").forEach((comment) => {
        likeCommentControl(comment);
        editCommentControl(comment);
        cancelEditCommentControl(comment);
        removeCommentControl(comment);
        photoUpload_editComment(comment);
        removePhoto_editComment(comment);
    });

});