document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.getElementById('posts-container');

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        const posts = postsContainer.querySelectorAll('.d-flex.justify-content-between.align-items-start.mb-3');

        posts.forEach(post => {
            const postText = post.textContent.toLowerCase();
            if (postText.includes(searchTerm)) {
                post.style.display = '';
            } else {
                post.style.display = 'none';
            }
        });
    });
});
