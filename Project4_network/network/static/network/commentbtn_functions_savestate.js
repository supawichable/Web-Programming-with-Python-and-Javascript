document.addEventListener('DOMContentLoaded', function() {

    document.querySelectorAll(".postwrap").forEach((post) => {
        saveState_commentPostControl(post);
    });

});