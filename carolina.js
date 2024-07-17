document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const editIdInput = document.createElement('input');

    const charLimit = 250;
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('char-count');

    editIdInput.type = 'hidden';
    editIdInput.id = 'edit-id';
    postForm.appendChild(editIdInput);

    messageInput.addEventListener('input', updateCharCount);

    function updateCharCount() {
        const currentLength = messageInput.value.length;
        charCountDisplay.textContent = `${currentLength}/${charLimit} characters`;
        charCountDisplay.style.color = currentLength > charLimit ? 'red' : 'black';
        postForm.querySelector('button[type="submit"]').disabled = currentLength > charLimit;
    }

    postForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const content = messageInput.value.trim();
        const author = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const editId = document.getElementById('edit-id').value;

        if (content === '' || author === '' || email === '') {
            alert('All fields are required!');
            return;
        }

        if (editId) {
            updatePost(parseInt(editId), content, author, email);
        } else {
            createPost(content, author, email);
        }

        e.target.reset();
        document.getElementById('edit-id').value = '';
        document.querySelector('.btn-close').click();
        updateCharCount();
    });

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function createPost(content, author, email) {
        const posts = getPosts();
        const newPost = {
            id: Date.now(),
            content,
            author,
            email,
        };
        posts.push(newPost);
        savePosts(posts);
        displayPosts();
    }

    function createComment(postId, username, content) {
        const comments = getComments();
        const newComment = {
            id: Date.now(),
            content,
            postId,
            username,
            date: new Date().toLocaleString(),
        };
        if (!comments[postId]) {
            comments[postId] = [];
        }
        comments[postId].push(newComment);
        saveComments(comments);
        displayComments(postId);
    }

    function displayComments(postId) {
        const comments = getComments();
        const commentsContainer = document.getElementById(`comments-container-${postId}`);
        commentsContainer.innerHTML = '';

        if (comments[postId]) {
            comments[postId].forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('mb-2');
                commentElement.innerHTML = `
                    <p><strong>${comment.username}:</strong> ${comment.content} <small class="text-muted">(${comment.date})</small></p>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    }

    function getComments() {
        return JSON.parse(localStorage.getItem('comments')) || {};
    }

    function saveComments(comments) {
        localStorage.setItem('comments', JSON.stringify(comments));
    }

    function displayPosts() {
        const posts = getPosts();
        postsContainer.innerHTML = '';

        const fragment = document.createDocumentFragment();
        posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('card', 'mb-3');
            postElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center">
                            <div>
                                <h6 class="mb-0">${post.author}</h6>
                                <p class="text-muted mb-0">${post.content}</p>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" data-edit="${post.id}">Edit</button>
                            <button class="btn btn-sm btn-dark" data-delete="${post.id}">Delete</button>
                        </div>
                    </div>
                    <div id="comments-container-${post.id}">
                        <!-- Comments will be dynamically added here -->
                    </div>
                    <form class="d-flex mt-2" data-post-id="${post.id}">
                        <input type="text" class="form-control me-2" placeholder="Your username..." aria-label="Username" id="comment-username">
                        <input type="text" class="form-control me-2" placeholder="Add a comment..." aria-label="Comment">
                        <button class="btn btn-primary" type="submit">Comment</button>
                    </form>
                </div>
            `;
            fragment.appendChild(postElement);
        });

        postsContainer.appendChild(fragment);

        // Display comments for each post
        posts.forEach(post => displayComments(post.id));
    }

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        const posts = getPosts();

        postsContainer.innerHTML = '';
        const filteredPosts = posts.filter(post =>
            post.content.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm)
        );

        const fragment = document.createDocumentFragment();

        filteredPosts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('card', 'mb-3');
            postElement.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <div class="d-flex align-items-center">
                            <div>
                                <h6 class="mb-0">${post.author}</h6>
                                <p class="text-muted mb-0">${post.content}</p>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" data-edit="${post.id}">Edit</button>
                            <button class="btn btn-sm btn-dark" data-delete="${post.id}">Delete</button>
                        </div>
                    </div>
                    <div id="comments-container-${post.id}">
                        <!-- Comments will be dynamically added here -->
                    </div>
                    <form class="d-flex mt-2" data-post-id="${post.id}">
                        <input type="text" class="form-control me-2" placeholder="Your username..." aria-label="Username" id="comment-username">
                        <input type="text" class="form-control me-2" placeholder="Add a comment..." aria-label="Comment">
                        <button class="btn btn-primary" type="submit">Comment</button>
                    </form>
                </div>
            `;
            fragment.appendChild(postElement);
        });

        postsContainer.appendChild(fragment);
    });

    postsContainer.addEventListener('click', (e) => {
        const editId = e.target.dataset.edit;
        const deleteId = e.target.dataset.delete;

        if (editId) {
            editPost(parseInt(editId));
        } else if (deleteId) {
            deletePost(parseInt(deleteId));
        }
    });

    postsContainer.addEventListener('submit', (e) => {
        e.preventDefault();
        const postId = e.target.dataset.postId;
        const username = e.target.querySelector('#comment-username').value.trim();
        const content = e.target.querySelector('input[aria-label="Comment"]').value.trim();

        if (username === '' || content === '') {
            alert('Both username and comment are required!');
            return;
        }

        createComment(postId, username, content);
        e.target.reset();
    });

    function updatePost(id, content, author, email) {
        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = {
                id,
                content,
                author,
                email,
            };
            savePosts(posts);
            displayPosts();
        }
    }

    function editPost(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            document.getElementById('name').value = post.author;
            document.getElementById('email').value = post.email;
            document.getElementById('message').value = post.content;
            document.getElementById('edit-id').value = id;
            new bootstrap.Modal(document.getElementById('formModal')).show();
        }
    }

    function deletePost(id) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        savePosts(posts);
        displayPosts();
    }

    displayPosts();
});
