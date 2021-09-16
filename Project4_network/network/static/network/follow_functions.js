function followControl(userinfo) {
    const user_id = parseInt(userinfo.id.substring(5));
    const follow_btn = userinfo.querySelector('.follow-btn');

    fetch(`/user/${user_id}`)
    .then(response => response.json())
    .then(profile_user => {
        fetch("/user/")
        .then(response => response.json())
        .then(user => {
            if (profile_user.followers.includes(user.username)) {
                follow_btn.innerHTML = "Unfollow";
                follow_btn.classList.add("btn-primary");
            } else {
                follow_btn.innerHTML = "Follow";
                follow_btn.classList.add("btn-outline-primary");
            }
        });
    });
    
    follow_btn.addEventListener('click', (event) => {
        if (follow_btn.classList.contains("btn-outline-primary")) {
            follow_btn.classList.remove("btn-outline-primary");
            follow_btn.classList.add("btn-primary");
            follow_btn.innerHTML = "Unfollow";
            follow(user_id);
        } else {
            follow_btn.classList.remove("btn-primary");
            follow_btn.classList.add("btn-outline-primary");
            follow_btn.innerHTML = "Follow";
            unfollow(user_id);
        }
        update_followers(user_id);
    });
}

function follow(user_id) {
    const csrftoken = getCookie('csrftoken');
    fetch(`/user_interact/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            followed: true
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
}

function unfollow(user_id) {
    const csrftoken = getCookie('csrftoken');
    fetch(`/user_interact/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            followed: false
        }),
        headers: {"X-CSRFToken": csrftoken}
    })
}

function update_followers(user_id) {
    fetch(`/user/${user_id}`)
    .then(response => response.json())
    .then(user => {
        const userinfowrap = document.querySelector(`#user-${user_id}`);
        if (user.follwers_num > 1) {
            userinfowrap.querySelector(".followers").innerHTML = `<strong>${user.follwers_num}</strong> followers`;
        } else {
            userinfowrap.querySelector(".followers").innerHTML = `<strong>${user.follwers_num}</strong> follower`;
        }
    
    })
}