let allArticles = data.articles; 

const themeButton = document.getElementById('theme-toggle');
const sortDropdown = document.getElementById('sort-select');
const articlesContainer = document.getElementById('news-container');
const featuredContainer = document.getElementById('popular-article');

const savedTheme = localStorage.getItem('theme') || 'light';
document.body.className = savedTheme;
themeButton.textContent = savedTheme === 'light' ? '🌞' : '🌜';

themeButton.onclick = () => {
  const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme);
  themeButton.textContent = newTheme === 'light' ? '🌞' : '🌜';
};

const categoryColors = {
  Health: 'badge-health',
  Technology: 'badge-technology',
  Arts: 'badge-arts',
  Finance: 'badge-finance',
  Environment: 'badge-environment',
  Travel: 'badge-travel',
  Automotive: 'badge-automotive',
  Society: 'badge-society'
};

const getBadgeColor = cat => categoryColors[cat] || 'badge-secondary';

const createArticleCard = (article, index) => {
  const readTime = Math.ceil(article.wordCount / 200);
  return `
    <div class="col-md-4">
      <div class="card shadow-sm border-0 h-100 article-card" data-index="${index}">
        <img src="${article.image}" class="card-img-top" alt="Image">
        <div class="card-body d-flex flex-column">
          <div class="mb-2"><span class="badge badge-category ${getBadgeColor(article.category)}">${article.category}</span></div>
          <h5 class="card-title">${article.title}</h5>
          <h6 class="card-subtitle mb-2 views-meta">${article.date}</h6>
          <p class="card-text">${article.content.slice(0, 120)}...</p>
          <p class="mt-auto views-meta">Views: ${article.views} · ${readTime} min read</p>
          <a href="#" class="btn btn-sm btn-read">Read more</a>
        </div>
      </div>
    </div>`;
};

const renderAllArticles = () => {
  articlesContainer.innerHTML = allArticles.map((a, i) => createArticleCard(a, i)).join('');

  document.querySelectorAll('.article-card').forEach(card => {
    card.onclick = () => {
      const index = +card.dataset.index;
      allArticles[index].views++;
      sortDropdown.value = 'views';
      sortAndRenderArticles();
    };
  });
};

const renderMostPopularArticle = () => {
  const top = allArticles.reduce((a, b) => a.views > b.views ? a : b);
  const readTime = Math.ceil(top.wordCount / 200);
  featuredContainer.innerHTML = `
    <img src="${top.image}" class="card-img-top" alt="Popular">
    <div class="card-body">
      <div class="mb-2"><span class="badge badge-category ${getBadgeColor(top.category)}">${top.category}</span></div>
      <h5 class="card-title">${top.title}</h5>
      <p class="card-text">${top.content.slice(0, 150)}...</p>
      <p class="views-meta">Views: ${top.views} · ${readTime} min read</p>
      <a href="#" class="btn btn-sm btn-read">Read more</a>
    </div>`;
};

const sortAndRenderArticles = () => {
  const sortBy = sortDropdown.value;
  allArticles.sort((a, b) => sortBy === 'views' ? b.views - a.views : new Date(b.date) - new Date(a.date));
  renderAllArticles();
  renderMostPopularArticle();
};

sortDropdown.onchange = sortAndRenderArticles;

sortAndRenderArticles();
