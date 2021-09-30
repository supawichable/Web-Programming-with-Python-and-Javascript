/*
Photo upload control functions for Register and Edit Profile
*/

function photoUpload_profile() {
    const photoInput = document.getElementById('upload-profile-img');
    const sizeLimit = 1024 * 1024 * 12;
    const status = document.getElementById("status");
    var buf;

    photoInput.addEventListener('change', (event) => {
        const photos = photoInput.files;
        if (photos.length) {
            const photo = photos[0];
            if (photo.size > sizeLimit) {
                alert("Please choose a file smaller than 12MB");
                photo.value = '';
                return;
            } else {
                buf = photo;
                previewPhoto_profile(photo);
                status.value ="changed";
            }
        } else {
            console.log("canceled");
            console.log(buf);
            const dt = new DataTransfer();
            dt.items.add(buf);
            photoInput.files = dt.files;
            return;
        }
    });
}

function previewPhoto_profile(photo) {
    const preview = document.getElementById('preview');
    const img = document.querySelector("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        preview.append(img);

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
    const post_id = parseInt(newcomment.id.substring(11));
    const photoInput = newcomment.querySelector(`#upload-img-${post_id}`);
    const sizeLimit = 1024 * 1024 * 12;
    var buf;

    if(photoInput) {
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            if (photos.length) {
                const photo = photos[0];
                if (photo.size > sizeLimit) {
                    alert("Please choose a file smaller than 12MB");
                    photo.value = '';
                    return;
                } else {
                    buf = photo;
                    previewPhoto_addComment(newcomment, photo);
                }   
            } else {
                console.log("canceled");
                console.log(buf);
                const dt = new DataTransfer();
                dt.items.add(buf);
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_addComment(newcomment, photo) {
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
    const post_id = parseInt(newcomment.id.substring(11));
    const photoInput = newcomment.querySelector(`#upload-img-${post_id}`);
    const preview = newcomment.querySelector(`#preview-commentphotos-${post_id}`);
    photo.addEventListener('click', (event) => {
        // console.log("Deleted");
        photoInput.value = "";
        preview.innerHTML = "";
        // photo.style.display = "none";
        // const fileListArr = Array.from(photoInput.files);
        // console.log(fileListArr);
        // fileListArr.splice(0,1);
        // const dt = new DataTransfer();
        // for (let i = 0; i < fileListArr.length; i++){
        //     dt.items.add(fileListArr[i]);
        // }
        // photoInput.files = dt.files;
        console.log(photoInput.files);
    });
}

/*
Photo upload control functions for Edit Comment
*/

function photoUpload_editComment(comment) {
    const comment_id = parseInt(comment.id.substring(12));
    // console.log(comment_id);
    const photoInput = comment.querySelector(`#upload-img-editcomment-${comment_id}`);
    // const photoInput = comment.querySelector(".upload-img-editcomment");
    // console.log(photoInput);
    const sizeLimit = 1024 * 1024 * 12;
    const status = comment.querySelector(`#status-${comment_id}`);
    var buf;

    if(photoInput){
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            if (photos.length) {
                const photo = photos[0];
                if (photo.size > sizeLimit) {
                    alert("Please choose a file smaller than 12MB");
                    photo.value = '';
                    return;
                } else {
                    buf = photo;
                    previewPhoto_editComment(comment, photo);
                    status.value="changed";
                }
            } else {
                console.log("canceled");
                console.log(buf);
                const dt = new DataTransfer();
                dt.items.add(buf);
                photoInput.files = dt.files;
                return;
            }
        });
    }
}

function previewPhoto_editComment(comment, photo) {
    const comment_id = parseInt(comment.id.substring(12));
    const preview = comment.querySelector(`#comment-img-wrap-${comment_id}`);
    preview.innerHTML = "";
    const img = document.createElement("img");
    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        img.src = imageUrl;
        img.classList = "recently-added";
        preview.append(img);
        removePhoto_editComment(comment);
    }
    reader.readAsDataURL(photo);
}

function removePhoto_editComment(comment) {
    const comment_id = parseInt(comment.id.substring(12));
    const photoInput = comment.querySelector(`#upload-img-editcomment-${comment_id}`);
    const preview = comment.querySelector(`#comment-img-wrap-${comment_id}`);
    const status = comment.querySelector(`#status-${comment_id}`);
    if(preview) {
        preview.addEventListener('click', (event) => {
            photoInput.value = "";
            preview.innerHTML = "";
            status.value = "deleted";
            console.log(photoInput.files);
        });
    }
}

/*
Photo upload control functions for AddPost
*/

function photoUpload_addPost(){
    const photoInput = document.getElementById('upload-img-newpost');
    const sizeLimit = 1024 * 1024 * 12;
    console.log(photoInput);
    var buf = [];

    if (photoInput){
        photoInput.addEventListener('change', (event) => {
            const photos = photoInput.files;
            if (photos.length) {
                if (buf.length + photos.length > 4) {
                    alert("You can post only up to 4 photos per time.");
                    photos.value = "";
                    return;
                } else {
                    for (let i = 0; i < photos.length; i++) {
                        const photo = photos[i];
                        if (photo.size > sizeLimit) {
                            alert("Please choose a file smaller than 12MB");
                            photo.value = '';
                            return;
                        } else {
                            buf.push(photo);
                            const dt = new DataTransfer();
                            for (let i = 0; i < buf.length; i++){
                                dt.items.add(buf[i]);
                            }
                            photoInput.files = dt.files;
                            console.log(photoInput.files);
                            previewPhoto_addPost(photo, buf);
                        }
                    } 
                }
            } else {
                console.log("canceled");
                const dt = new DataTransfer();
                for (let i = 0; i < buf.length; i++){
                    dt.items.add(buf[i]);
                }
                photoInput.files = dt.files;
                console.log(photoInput.files);
                return;
            }
        });
    }
}

function previewPhoto_addPost(photo, buf) {
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
    // const photoInput = document.getElementById('#upload-img-newpost');
    // const preview = document.querySelector(".preview-postphotos");
    img.addEventListener('click', (event) => {
        for (var i = 0; i < buf.length; i++){
            if (buf[i] == photo) {
                buf.splice(i, 1);
                console.log('spliced');
            }
        }
        console.log(buf);
        img.style.display = "none";
    });
}

/*
Photo upload control functions for EditPost
*/

// function reloadPreview(post, status) {
//     status.buf_existing = [];
//     status.buf_new = [];
//     status.existing_photos_num = 0;

//     const preview_img = post.querySelector('.post-img-wrap-editpost');
//     preview_img.querySelectorAll('img').forEach((img) => {
//         img.style.display = "none";
//         // preview_img.remove(img);
//     })

//     // show all existing images in preview
//     const existing_img = post.querySelector('.post-img-wrap');
//     if (existing_img) {
//         existing_img.querySelectorAll('img').forEach((img) => {
//             const new_img = document.createElement('img');
//             new_img.src = img.src;
//             new_img.className = "post-img-editpost";
//             preview_img.append(new_img);
//             status.buf_existing.push(new_img);
//             status.existing_photos_num++;
//             previewPhoto_editPost(post, new_img, status.buf_existing);
//             removePhoto_editPost(post, new_img, new_img, status.buf_existing);
//         });
//     }
// }

function photoUpload_editPost(post){
    const post_id = parseInt(post.id.substring(9));
    const photoInput = post.querySelector(`#upload-img-editpost-${post_id}`);
    const sizeLimit = 1024 * 1024 * 12;
    // var deleted_info = post.querySelector("#deleted");
    // deleted_info.value = JSON.stringify(deleted);

    // const status = post.querySelector(`#status-editpost-${post_id}`);
    var existing = [];
    var added = [];
    var deleted = [];
    // var existing_photos_num = 0;
    var current_num = 0;

    var status = {"existing": existing, "added": added, "deleted":deleted, "current_num": current_num};
    // var current_num_html = post.querySelector('#current_num');

    // post.querySelectorAll('.post-img-editpost').forEach((img) => {
    post.querySelectorAll('.post-img-editpost').forEach((img) => {
        // status.existing_photos_num++;
        status.current_num++;
        status.existing.push(img);
    });

    const status_html = post.querySelector('#status');
    status_html.value = JSON.stringify(status);

    for (var i = 0; i < status.existing.length; i++){
        const photo = status.existing[i];
        removePhoto_editPost(post, photo, photo);
    }

    if(photoInput){
        photoInput.addEventListener('change',(event) => {
            // console.log("PHOTO NUM: ", status.existing_photos_num);
            const status_html = post.querySelector('#status');
            status = JSON.parse(status_html.value);

            const photos = photoInput.files;
            if (photos.length) {
                // var deleted_info = post.querySelector('#deleted');
                // const deleted = JSON.parse(deleted_info.value);
                // deleted_info.value = JSON.stringify(deleted);
                // console.log("Uploads: ", photos.length);
                // console.log("Previosuly Added: ", status.added.length);
                // console.log("Existing: ", status.existing.length);
                // console.log("Deleted: ", status.deleted.length);
                // Check if (newly) Uploaded + Existing + (previously) Added - Deleted > 4
                if (photos.length + status.existing.length + status.added.length - status.deleted.length > 4) {
                    alert("You can post only up to 4 photos per time.");
                    const dt = new DataTransfer();
                    for (let i = 0; i < status.added.length; i++){
                        dt.items.add(status.added[i]);
                    }
                    photoInput.files = dt.files;
                } else {
                    for (var i = 0; i < photos.length; i++){
                        const photo = photos[i];
                        if (photo.size > sizeLimit) {
                            alert("Please choose a file smaller than 12MB");
                            photo.value = "";
                            // const dt = new DataTransfer();
                            // photoInput.files = dt.files;
                            // return;
                        } else {
                            status.added.push(photo);
                            const dt = new DataTransfer();
                            for (let i = 0; i < status.added.length; i++){
                                dt.items.add(status.added[i]);
                            }
                            photoInput.files = dt.files;
                            status.current_num++;
                            // current_num_html.value = status.current_num;
                            // console.log(photoInput.files);
                            // var deleted_info = post.querySelector("#deleted");
                            // console.log(deleted_info.value);
                            previewPhoto_editPost(post, photo);
                        }
                    }
                    const status_html = post.querySelector('#status');
                    status_html.value = JSON.stringify(status);
                }
            } else {
                console.log("canceled");
                const dt = new DataTransfer();
                for (let i = 0; i < status.added.length; i++){
                    dt.items.add(status.added[i]);
                }
                photoInput.files = dt.files;
                console.log(photoInput.files);
                return;
            }
        });
    }
}

function previewPhoto_editPost(post, photo){
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
    // var current_num_html = post.querySelector('#current_num');
    img.addEventListener('click', (event) => {
        const status_html = post.querySelector('#status');
        var status = JSON.parse(status_html.value);

        if (img === photo) {
            // var deleted_info = post.querySelector('#deleted');
            // const deleted = JSON.parse(deleted_info.value);
            // console.log("DELETED: ", deleted);
            status.deleted.push(img.src);
            // console.log("DELETED2: ", deleted);
            // console.log("DELETED3: ", deleted)
            // current_num_html.value = status.current_num;
        }

        for (var i = 0; i < status.added.length; i++){
            if (status.added[i] == photo) {
                status.added.splice(i, 1);
                console.log('spliced');
                status.current_num--;
                // current_num_html.value = status.current_num;
            }
        }

        status.current_num--;
        status_html.value = JSON.stringify(status);
        // console.log(status.buf_new);
        img.style.display = "none";
        // current_num_html.value = status.current_num;
    });
}