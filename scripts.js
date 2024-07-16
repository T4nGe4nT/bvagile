// Event listener for form submission with validation
document.querySelector('.modal-body form').addEventListener('submit', function(e) {
    e.preventDefault();  // Prevent the default form submission behavior
    const content = document.getElementById('message').value.trim();  // Capture and trim the content input
    const author = document.getElementById('name').value.trim();    // Capture and trim the author input
    const email = document.getElementById('email').value.trim();      // Capture and trim the email input

    if (content === '' || author === '' || email === '') {
        alert('All fields are required!');  // Display error if any field is empty
        return;
    }
    if (!validateEmail(email)) {
        alert('Invalid email address!');  // Display error if email is invalid
        return;
    }

    // If inputs are valid, create a new post
    createPost(content, author, email);
    e.target.reset();  // Reset the form fields
    document.querySelector('.btn-close').click();  // Close the modal
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
        id: Date.now(),  // Generate a unique ID based on the current timestamp
        content,  // Message content
        author,   // Name of the author
        email,    // Email address of the author
        date: new Date().toLocaleString()  // Current date and time
    };
    posts.push(newPost);  // Add the new post to the posts array
    savePosts(posts);     // Save the updated posts array to localStorage
}

// Display posts on page load
document.addEventListener('DOMContentLoaded', displayPosts);
