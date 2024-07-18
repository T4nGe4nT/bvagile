document.addEventListener('DOMContentLoaded', () => {
    const apiToken = 'KNypmCi9W2li8Ak7IChfSm0YAtnCx4xgqfJ8YgW4';
    const url = `https://api.thenewsapi.com/v1/news/top?api_token=${apiToken}&locale=us&limit=3`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = ''; // Clear any previous content

            if (data.data && data.data.length > 0) {
                data.data.forEach(article => {
                    if (!article.image_url || !article.title || !article.description) {
                        return;
                    }

                    const articleElement = document.createElement('div');
                    articleElement.classList.add('col-md-12', 'mb-3');

                    articleElement.innerHTML = `
                        <div class="card">
                            <img src="${article.image_url}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.description}</p>
                                <a href="${article.url}" class="btn btn-primary" target="_blank">Read more</a>
                            </div>
                        </div>
                    `;

                    newsContainer.appendChild(articleElement);
                });
            } else {
                newsContainer.textContent = 'No news found.';
            }
        })
        .catch(error => {
            console.error('Error fetching news:', error);
            const newsContainer = document.getElementById('news-container');
            newsContainer.textContent = 'An error occurred while fetching news.';
        });
});
