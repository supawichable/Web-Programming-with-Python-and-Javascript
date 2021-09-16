function renderNewPostSection(){
    const newpost = document.querySelector("#newpost");
    newpost.style.display = "none";
}

function newPostControl(){
    const newpost_btn = document.querySelector("#newpost-btn");
    newpost_btn.addEventListener('click', (event) => {
        const newpost = document.querySelector("#newpost"); 
        if (newpost.style.display === "none") {
            newpost.style.display = "block";
            newpost_btn.className = "btn btn-primary";
            newpost_btn.innerHTML = "▲ What are you thinking?";
        } else {
            newpost.style.display = "none";
            newpost_btn.className = "btn btn-outline-primary";
            newpost_btn.innerHTML = "▼ What are you thinking?";
        }
    });   
}