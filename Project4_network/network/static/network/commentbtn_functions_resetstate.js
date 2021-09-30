document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".postwrap").forEach((post) => {
        resetState_commentPostControl(post);
    });

});