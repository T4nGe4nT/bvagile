document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
    const postsContainer = document.getElementById('posts-container');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');
    const editIdInput = document.createElement('input');
    editIdInput.type = 'hidden';
    editIdInput.id = 'edit-id';
    postForm.appendChild(editIdInput);

    // Event listener for form submission with validation
    postForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const content = document.getElementById('message').value.trim();
        const author = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const editId = document.getElementById('edit-id').value;

        if (content === '' || author === '' || email === '') {
            alert('All fields are required!');
            return;
        }
        if (!validateEmail(email)) {
            alert('Invalid email address!');
            return;
        }

        // If inputs are valid, create or update a post
        if (editId) {
            updatePost(parseInt(editId), content, author, email);
        } else {
            createPost(content, author, email);
        }

        e.target.reset();
        document.getElementById('edit-id').value = '';
        document.querySelector('.btn-close').click();
    });

    // Function to validate email addresses
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()\[\]\\.,;:\s@"]+\.)+[^<>()\[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    // Utility function to get posts from localStorage
    function getPosts() {
        return JSON.parse(localStorage.getItem('posts')) || [];
    }

    // Utility function to save posts to localStorage
    function savePosts(posts) {
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    // Function to create a new post using the validated input values
    function createPost(content, author, email) {
        const posts = getPosts();
        const newPost = {
            id: Date.now(),
            content,
            author,
            email,
            date: new Date().toLocaleString()
        };
        posts.push(newPost);
        savePosts(posts);
        displayPosts();
    }

    // Function to update an existing post
    function updatePost(id, content, author, email) {
        const posts = getPosts();
        const postIndex = posts.findIndex(p => p.id === id);
        if (postIndex !== -1) {
            posts[postIndex] = {
                id,
                content,
                author,
                email,
                date: new Date().toLocaleString()
            };
            savePosts(posts);
            displayPosts();
        }
    }

    // Function to edit a post
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

    // Function to delete a post
    function deletePost(id) {
        let posts = getPosts();
        posts = posts.filter(p => p.id !== id);
        savePosts(posts);
        displayPosts();
    }

    // Function to display posts in the UI
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
                </div>
            `;
            fragment.appendChild(postElement);
        });

        postsContainer.appendChild(fragment);
    }

    // Display posts on page load
    displayPosts();

    // Search functionality
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
                </div>
            `;
            fragment.appendChild(postElement);
        });

        postsContainer.appendChild(fragment);
    });

    // Event delegation for edit and delete buttons
    postsContainer.addEventListener('click', (e) => {
        const editId = e.target.dataset.edit;
        const deleteId = e.target.dataset.delete;

        if (editId) {
            editPost(parseInt(editId));
        } else if (deleteId) {
            deletePost(parseInt(deleteId));
        }
    });
});
