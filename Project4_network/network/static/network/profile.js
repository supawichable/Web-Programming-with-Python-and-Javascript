document.addEventListener('DOMContentLoaded', function() {

    const userinfo = document.querySelector(".userinfowrap");
    if (userinfo.querySelector(".follow-btn")){
        followControl(userinfo);
    }
    
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