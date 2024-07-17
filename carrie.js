

// Event listener for form submission with validation

postForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const content = document.getElementById('message').value.trim();
    const author = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const image = document.getElementById('image').files[0]; // Get the first file (assuming only one file is uploaded)
    const editId = document.getElementById('edit-id').value;

    if (content === '' || author === '' || email === '') {
        alert('All fields are required!');
        return;
    }
    if (!validateEmail(email)) {
        alert('Invalid email address!');
        return;
    }

    // Prepare post object to save in local storage
    const newPost = {
        id: Date.now(),
        content,
        author,
        email,
        image: image ? URL.createObjectURL(image) : null, // Store image URL or null if no image
        date: new Date().toLocaleString()
    };

    if (editId) {
        updatePost(parseInt(editId), newPost); // Update existing post
    } else {
        createPost(newPost); // Create new post
    }

    e.target.reset();
    document.getElementById('edit-id').value = '';
    document.querySelector('.btn-close').click();
});

// Function to create a new post in local storage
function createPost(post) {  // New function added
    const posts = getPosts();
    posts.push(post);
    savePosts(posts);
    displayPosts();
}

// Function to update an existing post in local storage
function updatePost(id, updatedPost) {  // New function added
    let posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === id);
    if (postIndex !== -1) {
        posts[postIndex] = updatedPost;
        savePosts(posts);
        displayPosts();
    }
}

// Function to display posts in the UI
function displayPosts() {  // Updated function to display images
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
                            ${post.image ? `<img src="${post.image}" class="img-fluid img-preview" />` : ''}
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
