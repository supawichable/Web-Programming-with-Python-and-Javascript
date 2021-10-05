/*
Photo upload control functions for Register and Edit Profile
*/

function photoUpload_profile() {
    /*
    handle profile photo uploading for registering for a new account/editing profile
    */
    const photoInput = document.getElementById('upload-profile-img');
    const sizeLimit = 1024 * 1024 * 12;
    const status = document.getElementById("status");
    var buf;

    photoInput.addEventListener('change', (event) => {
        const photos = photoInput.files;
        // check if an image is uploaded
        if (photos.length) {
            const photo = photos[0];
            // check that it does not exceed the file size limit of 12MB
            if (photo.size > sizeLimit) {
                alert("Please choose a file smaller than 12MB");
                photo.value = '';
                return;
            // preview the uploaded image
            } else {
                buf = photo;
                previewPhoto_profile(photo);
                status.value ="changed";
            }
        // if upload is clicked but user ends up canceling the upload, 
        // retains the image previously uploaded (if there is)
        } else {
            const dt = new DataTransfer();
            dt.items.add(buf);
            photoInput.files = dt.files;
            return;
        }
    });
}

function previewPhoto_profile(photo) {
    /*
    handle profile photo previewing for registering for a new account/editing profile
    */
    const preview = document.getElementById('preview');
    const img = document.querySelector("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        // preview uploaded image in preview section
        const imageUrl = event.target.result;
        img.src = imageUrl;
        preview.append(img);

        // append clear and revert button adter an image is uploaded
        if (document.getElementById('clear-button')){
            const clearButton = document.getElementById('clear-button');
            clearButton.classList.remove('btn-outline-danger');
            clearButton.classList.add('btn-danger');
        }

        if (document.getElementById('revert-button')){
            const revertButton = document.getElementById('revert-button');
            revertButton.classList.remove('btn-outline-primary');
            revertButton.classList.add('btn-primary');
        }
    }
    reader.readAsDataURL(photo);
}

function removePhoto_profile() {
    /*
    handle profile photo removal for registering for a new account/editing profile
    */
    const clearButton = document.getElementById('clear-button');
    const photoInput = document.getElementById('upload-profile-img');
    const preview = document.getElementById('preview');
    const img = document.querySelector("img");
    const status = document.getElementById("status");

    clearButton.addEventListener('click', (event) => {
        photoInput.value = "";
        status.value = "deleted";
        preview.innerHTML = "";
        img.src = "../static/images/profile_img/default1.jpg";
        preview.append(img);

        clearButton.classList.remove('btn-danger');
        clearButton.classList.add('btn-outline-danger');

        const revertButton = document.getElementById('revert-button');
        revertButton.classList.remove('btn-primary');
        revertButton.classList.add('btn-outline-primary');
    })
}

function revertPhoto_profile() {    
    /*
    handle profile photo reverting for registering for a new account/editing profile
    */
    const revertButton = document.getElementById('revert-button');
    const photoInput = document.getElementById('upload-profile-img');
    const status = document.getElementById("status");
    const preview = document.getElementById('preview');
    const img = document.querySelector("img");
    const imgUrl = img.src;

    revertButton.addEventListener('click', (event) => {
        photoInput.value = "";
        status.value = "unchanged";
        preview.innerHTML = "";
        img.src = imgUrl;
        preview.append(img);

        const clearButton = document.getElementById('clear-button');
        clearButton.classList.remove('btn-danger');
        clearButton.classList.add('btn-outline-danger');

        const revertButton = document.getElementById('revert-button');
        revertButton.classList.remove('btn-primary');
        revertButton.classList.add('btn-outline-primary');
    })
}

/*
Photo upload control functions for AddComment
*/

function photoUpload_addComment(newcomment) {
    /*
    handle comment photo's uploading for adding a new comment
    */
    const post_id = parseInt(newcomment.id.substring(11));
    const photoInput = newcomment.querySelector(`#upload-img-${post_id}`);
    const sizeLimit = 1024 * 1024 * 12;
    var buf;

    if(photoInput) {
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            // check if an image is uploaded
            if (photos.length) {
                const photo = photos[0];
                // check that it does not exceed the file size limit of 12MB
                if (photo.size > sizeLimit) {
                    alert("Please choose a file smaller than 12MB");
                    photo.value = '';
                    return;
                // preview the uploaded image
                } else {
                    buf = photo;
                    previewPhoto_addComment(newcomment, photo);
                }   
            // if upload is clicked but user ends up canceling the upload, 
            // retains the image previously uploaded (if there is)
            } else {
                const dt = new DataTransfer();
                dt.items.add(buf);
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_addComment(newcomment, photo) {    
    /*
    handle comment photo previewing for adding a new comment
    */
    const post_id = parseInt(newcomment.id.substring(11));
    const preview = newcomment.querySelector(`#preview-commentphotos-${post_id}`);
    preview.innerHTML = "";
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        preview.append(img);
        removePhoto_addComment(newcomment, img);
    }
    reader.readAsDataURL(photo);
}

function removePhoto_addComment(newcomment, photo) {
    /*
    handle comment photo's removal for adding a new comment
    */
    const post_id = parseInt(newcomment.id.substring(11));
    const photoInput = newcomment.querySelector(`#upload-img-${post_id}`);
    const preview = newcomment.querySelector(`#preview-commentphotos-${post_id}`);
    // remove the uploaded image when it is clicked
    photo.addEventListener('click', (event) => {
        photoInput.value = "";
        preview.innerHTML = "";
    });
}

/*
Photo upload control functions for Edit Comment
*/

function photoUpload_editComment(comment) {
    /*
    handle comment photo uploading for editing a comment
    */
    const comment_id = parseInt(comment.id.substring(12));
    const photoInput = comment.querySelector(`#upload-img-editcomment-${comment_id}`);
    const sizeLimit = 1024 * 1024 * 12;
    const status = comment.querySelector(`#status-${comment_id}`);
    var buf;

    if(photoInput){
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            // check if an image is uploaded
            if (photos.length) {
                const photo = photos[0];
                // check that it does not exceed the file size limit of 12MB
                if (photo.size > sizeLimit) {
                    alert("Please choose a file smaller than 12MB");
                    photo.value = '';
                    return;
                // preview the uploaded image
                } else {
                    buf = photo;
                    previewPhoto_editComment(comment, photo);
                    status.value="changed";
                }
            // if upload is clicked but user ends up canceling the upload, 
            // retains the image previously uploaded (if there is)
            } else {
                const dt = new DataTransfer();
                dt.items.add(buf);
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_editComment(comment, photo) {
    /*
    handle comment photo previewing for editing a comment
    */
    const comment_id = parseInt(comment.id.substring(12));
    const preview = comment.querySelector(`#comment-img-wrap-${comment_id}`);
    preview.innerHTML = "";
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        img.classList = "recently-added comment-preview-img";
        preview.append(img);
        removePhoto_editComment(comment);
    }
    reader.readAsDataURL(photo);
}

function removePhoto_editComment(comment) {
    /*
    handle comment photo's removal for editing a comment
    */
    const comment_id = parseInt(comment.id.substring(12));
    const photoInput = comment.querySelector(`#upload-img-editcomment-${comment_id}`);
    const preview = comment.querySelector(`#comment-img-wrap-${comment_id}`);
    const status = comment.querySelector(`#status-${comment_id}`);
    if(preview) {
        // remove the uploaded image when it is clicked
        preview.addEventListener('click', (event) => {
            photoInput.value = "";
            preview.innerHTML = "";
            status.value = "deleted";
        });
    }
}

/*
Photo upload control functions for AddPost
*/

function photoUpload_addPost(){
    /*
    handle photo uploading for adding a new post
    */
    const photoInput = document.getElementById('upload-img-newpost');
    const sizeLimit = 1024 * 1024 * 12;
    var buf = [];

    if (photoInput){
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            // check if at least an image is uploaded
            if (photos.length) {
                // check that total number of images uploaded does not exceed 4 images
                if (buf.length + photos.length > 4) {
                    alert("You can post only up to 4 photos per time.");
                    photos.value = "";
                    return;
                } else {
                    for (let i = 0; i < photos.length; i++) {
                        const photo = photos[i];
                        // check that each uploaded image does not exceed the file size limit of 12MB
                        if (photo.size > sizeLimit) {
                            alert("Please choose a file smaller than 12MB");
                            photo.value = '';
                            return;
                        // preview the uploaded images
                        } else {
                            buf.push(photo);
                            const dt = new DataTransfer();
                            for (let i = 0; i < buf.length; i++){
                                dt.items.add(buf[i]);
                            }
                            photoInput.files = dt.files;
                            previewPhoto_addPost(photo, buf);
                        }
                    } 
                }
            // if upload is clicked but user ends up canceling the upload, 
            // retains the images previously uploaded (if there are)
            } else {
                const dt = new DataTransfer();
                for (let i = 0; i < buf.length; i++){
                    dt.items.add(buf[i]);
                }
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_addPost(photo, buf) {
    /*
    handle photo previewing for adding a new post
    */
    const preview = document.querySelector(".preview-postphotos");
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        preview.append(img);
        removePhoto_addPost(img, photo, buf);
    }
    reader.readAsDataURL(photo);
}

function removePhoto_addPost(img, photo, buf) {
    /*
    handle photo's removal for adding a new post
    */
    img.addEventListener('click', (event) => {
        for (var i = 0; i < buf.length; i++){
            if (buf[i] == photo) {
                buf.splice(i, 1);
            }
        }
        img.style.display = "none";
    });
}

/*
Photo upload control functions for EditPost
*/

function photoUpload_editPost(post){
    /*
    handle photo uploading for editing a post
    */
    const post_id = parseInt(post.id.substring(9));
    const photoInput = post.querySelector(`#upload-img-editpost-${post_id}`);
    const sizeLimit = 1024 * 1024 * 12;
    var existing = [];
    var added = [];
    var deleted = [];
    var current_num = 0;

    // status to be passed beween functions
    var status = {"existing": existing, "added": added, "deleted":deleted, "current_num": current_num};

    // updaye status for the post's existing images
    post.querySelectorAll('.post-img-editpost').forEach((img) => {
        status.current_num++;
        status.existing.push(img);
    });

    // save status value to a hidden field in HTML
    const status_html = post.querySelector('#status');
    status_html.value = JSON.stringify(status);

    // add remove listener for all existing images
    for (var i = 0; i < status.existing.length; i++){
        const photo = status.existing[i];
        removePhoto_editPost(post, photo, photo);
    }

    if(photoInput){
        photoInput.addEventListener('change',(event) => {
            const status_html = post.querySelector('#status');
            status = JSON.parse(status_html.value);

            const photos = photoInput.files;
            // check if at least an image is uploaded
            if (photos.length) {
                if (photos.length + status.existing.length - status.deleted.length > 4) {
                    alert("You can post only up to 4 photos per time.");
                    const dt = new DataTransfer();
                    for (let i = 0; i < status.added.length; i++){
                        dt.items.add(status.added[i]);
                    }
                    photoInput.files = dt.files;
                // preview the uploaded images
                } else {
                    for (var i = 0; i < photos.length; i++){
                        const photo = photos[i];
                        if (photo.size > sizeLimit) {
                            alert("Please choose a file smaller than 12MB");
                            photo.value = "";
                        } else {
                            status.added.push(photo);
                            const dt = new DataTransfer();
                            for (let i = 0; i < status.added.length; i++){
                                dt.items.add(status.added[i]);
                            }
                            photoInput.files = dt.files;
                            status.current_num++;
                            previewPhoto_editPost(post, photo);
                        }
                    }
                    const status_html = post.querySelector('#status');
                    status_html.value = JSON.stringify(status);
                }
            // if upload is clicked but user ends up canceling the upload, 
            // retains the images previously uploaded (if there is)
            } else {
                const dt = new DataTransfer();
                for (let i = 0; i < status.added.length; i++){
                    dt.items.add(status.added[i]);
                }
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_editPost(post, photo){
    /*
    handle photo previewing for editing a post
    */
    const post_id = parseInt(post.id.substring(9));
    const preview = post.querySelector(`#post-img-wrap-editpost-${post_id}`);
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        img.classList = "post-img-editpost recently-added";
        preview.append(img);
        removePhoto_editPost(post, img, photo);
    }
    reader.readAsDataURL(photo);
}

function removePhoto_editPost(post, img, photo) {
    /*
    handle photo's removal for editing a post
    */
    img.addEventListener('click', (event) => {
        const status_html = post.querySelector('#status');
        var status = JSON.parse(status_html.value);

        if (img === photo) {
            status.deleted.push(img.src);
        }

        for (var i = 0; i < status.added.length; i++){
            if (status.added[i] == photo) {
                status.added.splice(i, 1);
                status.current_num--;
            }
        }

        status.current_num--;
        status_html.value = JSON.stringify(status);;
        img.style.display = "none";
    });
}