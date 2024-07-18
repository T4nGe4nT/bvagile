document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'e6916882cf4c45788fafada1ff530605';
    const country = 'us';
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=${apiKey}`;
    const maxArticles = 10; // Limit the number of articles displayed

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            newsContainer.innerHTML = ''; // Clear any previous content

            if (data.articles && data.articles.length > 0) {
                const articlesToShow = data.articles.slice(0, maxArticles); // Limit the number of articles
                articlesToShow.forEach(article => {
                    if (article.title.includes('[Removed]') || 
                        (article.description && article.description.includes('[Removed]')) ||
                        !article.urlToImage) {
                        return;
                    }

                    const articleElement = document.createElement('div');
                    articleElement.classList.add('col-md-12', 'mb-3');

                    articleElement.innerHTML = `
                        <div class="card">
                            <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title.replace(/\[Removed\]/g, '')}</h5>
                                <p class="card-text">${article.description ? article.description.replace(/\[Removed\]/g, '') : ''}</p>
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
