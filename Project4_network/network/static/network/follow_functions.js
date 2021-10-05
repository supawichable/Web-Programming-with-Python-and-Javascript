function followControl(userinfo) {
    /*
    handle follow-unfollow buttons' switching and initial rendering
    */
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
        update_followers(userinfo);
    });
}

function follow(user_id) {
    /*
    send follow action's data to backend
    */
    const csrftoken = getCookie('csrftoken');
    fetch(`/user_interact/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            followed: true
        }),
        headers: {"X-CSRFToken": csrftoken}
    })

    var follower_self = document.querySelector('.dropdown-follower-self');
    follower_self.style.display = "block";
}

function unfollow(user_id) {
    /*
    send unfollow action's data to backend
    */
    const csrftoken = getCookie('csrftoken');
    fetch(`/user_interact/${user_id}`, {
        method: 'PUT',
        body: JSON.stringify({
            followed: false
        }),
        headers: {"X-CSRFToken": csrftoken}
    })

    var follower_self = document.querySelector('.dropdown-follower-self');
    follower_self.style.display = "none";
}

function update_followers(userinfo) {
    /*
    update number of followers in profile page when the user follows/unfollows someone
    */
    const user_id = parseInt(userinfo.id.substring(5));
    fetch(`/user/${user_id}`)
    .then(response => response.json())
    .then(user => {
        const userinfowrap = document.querySelector(`#user-${user_id}`);
        if (user.follwers_num > 1) {
            userinfowrap.querySelector(".followers").innerHTML = `<strong>${user.followers_num}</strong> followers`;
        } else {
            userinfowrap.querySelector(".followers").innerHTML = `<strong>${user.followers_num}</strong> follower`;
        }
    });
}

function dropdownControl(userinfo) {
    /*
    control followers/following's dropdowns
    */
    userinfo.querySelectorAll('.dropdown-content').forEach((dropdown) => {
        dropdown.style.display = "none";
    });

    document.addEventListener('click', (event) => {
        if(!event.target.classList.contains('dropdown')){
            document.querySelectorAll('.dropdown-content').forEach((dropdown_content) => {
                dropdown_content.style.display = "none";
            });
        }
    });

    // hide when click outside
    userinfo.querySelectorAll('.dropdown-btn').forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const id = btn.id.substring(13);
            const dropdown = userinfo.querySelector(`#dropdown-content-${id}`);
            if (dropdown.style.display === "none") {
                dropdown.style.display = "block";
            } else {
                dropdown.style.display = "none";
            }
        });
    });
}
