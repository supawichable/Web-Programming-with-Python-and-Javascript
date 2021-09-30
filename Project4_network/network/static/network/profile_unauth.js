document.addEventListener('DOMContentLoaded', function() {

    const userinfo = document.querySelector(".userinfowrap");
    update_followers(userinfo);
    dropdownControl(userinfo);
    
    document.querySelectorAll(".postwrap").forEach((post) => {
        likePostControl_unauth(post);
        editPostControl(post);
        resetState_commentPostControl(post);
    });

    document.querySelectorAll(".commentwrap").forEach((comment) => {
        likeCommentControl_unauth(comment);
    });

});