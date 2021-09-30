document.addEventListener('DOMContentLoaded', function() {


    const userinfo = document.querySelector(".userinfowrap");
    if (userinfo.querySelector(".follow-btn")){
        followControl(userinfo);
    }

    update_followers(userinfo);
    dropdownControl(userinfo);
    
    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl(post);
        editPostControl(post);
        cancelEditPostControl(post);
        profile_removePostControl(post);
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