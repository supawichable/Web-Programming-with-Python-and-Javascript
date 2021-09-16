function like(element_id, type) {
    // like a post or comment
    // type = "post" or "comment"
    const csrftoken = getCookie('csrftoken');
    fetch(`/${type}_interact/${element_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            like: true,
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
    .catch(error => {
        console.log("error");
    });
}

function unlike(element_id, type) {
    // unlike a post or comment
    // type = "post" or "comment"
    const csrftoken = getCookie('csrftoken');
    fetch(`/${type}_interact/${element_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            like: false
        }),
        headers: {"X-CSRFToken": csrftoken}
    });
}

function update_likes(element_id, like_btn, type){
    // update a post or comment's like number
    // type = "post" or "comment"
    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element => {
        if (element.likes === 0) {
            like_btn.innerHTML = 'Like';
        } else if (element.likes === 1) {
            like_btn.innerHTML = '1 Like';
        } else {
            like_btn.innerHTML = `${element.likes} Likes`;
        }
    });
}

function show_updated_text(element_id, type){
    // fetch an updated text and show it
    // type = "post" or "comment"
    fetch(`/${type}s/${element_id}`)
    .then(response => response.json())
    .then(element => {
        const text = document.getElementById(`${type}-text-${element_id}`);
        text.innerHTML = element.text;
        text.style.display = "block";
    });
}

// this function is retrieved from Django's official document
// https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}