document.addEventListener("DOMContentLoaded", () => {
    // Initialize posts from local storage
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Function to display posts in the UI
    function displayPosts() {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';

        posts.forEach((post, index) => {
            const postElement = document.createElement('div');
            postElement.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'mb-3');
            postElement.innerHTML = `
                <div class="d-flex">
                    <div>
                        <h6>${post.author}</h6>
                        <p class="mb-0">${post.content}</p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary me-2" onclick="editPost(${index})">Edit</button>
                    <button class="btn btn-sm btn-dark" onclick="deletePost(${index})">Delete</button>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Function to add a new post
    function addPost(author, content) {
        posts.push({
            author: author,
            content: content,
            date: new Date().toISOString().split('T')[0]
        });
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }

    // Function to update an existing post
    function updatePost(index, author, content) {
        posts[index].author = author;
        posts[index].content = content;
        localStorage.setItem('posts', JSON.stringify(posts));
        displayPosts();
    }

    // Function to handle form submission
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();

        const author = document.getElementById('name').value;
        const content = document.getElementById('message').value;
        const editIndex = document.getElementById('formModal').dataset.editIndex;

        if (editIndex !== undefined) {
            // Update existing post
            updatePost(editIndex, author, content);
        } else {
            // Add new post
            addPost(author, content);
        }

        // Reset form
        document.querySelector('form').reset();
        delete document.getElementById('formModal').dataset.editIndex;
        const modal = bootstrap.Modal.getInstance(document.getElementById('formModal'));
        modal.hide();
        displayPosts();
    });

     // Initial display of posts
    displayPosts();
});
