document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const editIdInput = document.createElement('input');
    const messageInput = document.getElementById('message');
    const charCountDisplay = document.getElementById('char-count');
    const formModal = new bootstrap.Modal(document.getElementById('formModal'));
    const modalTitle = document.getElementById('formModalLabel');
    const createPostBtn = document.getElementById('create-post-btn');

    // Constants
    const charLimit = 250;

    // Initialization
    editIdInput.type = 'hidden';
    editIdInput.id = 'edit-id';
    postForm.appendChild(editIdInput);

    // Event Listeners
    messageInput.addEventListener('input', updateCharCount);
    postForm.addEventListener('submit', handleFormSubmit);
    createPostBtn.addEventListener('click', prepareCreatePost);
    searchForm.addEventListener('submit', handleSearch);
    postsContainer.addEventListener('click', handlePostActions);
    postsContainer.addEventListener('submit', handleCommentSubmit);
    searchInput.addEventListener('input', handleSearch); // New event listener for dynamic search

    // Functions
    function updateCharCount() {
        const currentLength = messageInput.value.length;
        charCountDisplay.textContent = `${currentLength}/${charLimit} characters`;
        charCountDisplay.style.color = currentLength > charLimit ? 'red' : 'black';
        postForm.querySelector('button[type="submit"]').disabled = currentLength > charLimit;
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const content = messageInput.value.trim();
        const author = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const photoInput = document.getElementById('photo');
        let photoData = null;

        if (photoInput.files.length > 0) {
            const reader = new FileReader();
            reader.onload = (event) => {
                photoData = event.target.result;
                handlePostSubmission(content, author, email, photoData);
            };
            reader.readAsDataURL(photoInput.files[0]);
        } else {
            handlePostSubmission(content, author, email, photoData);
        }
    }

    function handlePostSubmission(content, author, email, photoData) {
        if (content === '' || author === '' || email === '') {
            alert('All fields are required!');
            return;
        }

        const editId = document.getElementById('edit-id').value;

        if (editId) {
            updatePost(parseInt(editId), content, author, email, photoData);
        } else {
            createPost(content, author, email, photoData);
        }

        postForm.reset();
        document.getElementById('edit-id').value = '';
        document.querySelector('.btn-close').click();
        updateCharCount();
    }

    function prepareCreatePost() {
        modalTitle.textContent = 'Create New Post';
        postForm.reset();
        updateCharCount();
    }

    function handleSearch(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        const posts = getPosts();

        postsContainer.innerHTML = '';
        const filteredPosts = posts.filter(post =>
            post.content.toLowerCase().includes(searchTerm) ||
            post.author.toLowerCase().includes(searchTerm)
        );

        displayPosts(filteredPosts);
    }

    function handlePostActions(e) {
        const editId = e.target.dataset.edit;
        const deleteId = e.target.dataset.delete;
        const upVoteId = e.target.dataset.upvote;
        const downVoteId = e.target.dataset.downvote;

        if (editId) {
            editPost(parseInt(editId));
        } else if (deleteId) {
            deletePost(parseInt(deleteId));
        } else if (upVoteId) {
            upVotePost(parseInt(upVoteId));
        } else if (downVoteId) {
            downVotePost(parseInt(downVoteId));
        }
    }

    function handleCommentSubmit(e) {
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
    }

    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function createPost(content, author, email, photoData) {
        const posts = getPosts();
        const newPost = {
            id: Date.now(),
            content,
            author,
            email,
            photo: photoData,
            upVotes: 0,
            downVotes: 0
        };
        posts.push(newPost);
        savePosts(posts);
        displayPosts(posts);
    }

    function createComment(postId, username, content) {
        const comments = getComments();
        const newComment = {
            id: Date.now(),
            content,
            postId,
            username,
            date: new Date().toLocaleString()
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

    function displayPosts(posts = getPosts()) {
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
                                <h5 class="mb-0"><strong>${post.author}</strong></h5>
                                <p class="text-muted mb-0">${post.content}</p>
                            </div>
                        </div>
                        <div>
                            <button class="btn btn-sm btn-primary me-2" data-edit="${post.id}">Edit</button>
                            <button class="btn btn-sm btn-dark" data-delete="${post.id}">Delete</button>
                        </div>
                    </div>
                    ${post.photo ? `<img src="${post.photo}" class="img-fluid mb-2" alt="Post Image">` : ''}
                    <button class="btn btn-sm btn-upvote me-2" data-upvote="${post.id}">⬆ (${post.upVotes})</button>
                    <button class="btn btn-sm btn-downvote" data-downvote="${post.id}">⬇ (${post.downVotes})</button>
                    <hr>
                    <div id="comments-container-${post.id}">
                        <!-- Comments will be dynamically added here -->
                    </div>
                    <form class="d-flex mt-2" data-post-id="${post.id}">
                        <input type="text" class="form-control me-2" placeholder="Name" aria-label="Username" id="comment-username">
                        <input type="text" class="form-control me-2" placeholder="Add a comment..." aria-label="Comment" id="comment-text">
                        <button class="btn btn-primary" type="submit" id="comment-btn">Comment</button>
                    </form>
                </div>
            `;
            fragment.appendChild(postElement);
        });

        postsContainer.appendChild(fragment);

        // Display comments for each post
        posts.forEach(post => displayComments(post.id));
    }

    function updatePost(id, content, author, email, photoData) {
        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = {
                id,
                content,
                author,
                email,
                photo: photoData,
                upVotes: posts[postIndex].upVotes,
                downVotes: posts[postIndex].downVotes
            };
            savePosts(posts);
            displayPosts(posts);
        }
    }

    function editPost(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            document.getElementById('name').value = post.author;
            document.getElementById('email').value = post.email;
            document.getElementById('message').value = post.content;
            modalTitle.textContent = 'Edit Post';
            formModal.show();
            document.getElementById('edit-id').value = id;
        }
    }

    function deletePost(id) {
        const posts = getPosts();
        const updatedPosts = posts.filter(post => post.id !== id);
        savePosts(updatedPosts);
        displayPosts(updatedPosts);
    }

    function upVotePost(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            post.upVotes += 1;
            savePosts(posts);
            displayPosts(posts);
        }
    }

    function downVotePost(id) {
        const posts = getPosts();
        const post = posts.find(p => p.id === id);
        if (post) {
            post.downVotes += 1;
            savePosts(posts);
            displayPosts(posts);
        }
    }

    // Initial render
    displayPosts();
});
