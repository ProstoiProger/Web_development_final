let allArticles = data.articles;

const themeButton = document.getElementById('theme-toggle');
const sortDropdown = document.getElementById('sort-select');
const articlesContainer = document.getElementById('news-container');
const featuredContainer = document.getElementById('popular-article');

document.body.className = localStorage.getItem('theme') || 'light';
themeButton.textContent = document.body.classList.contains('light') ? '🌞' : '🌜';

themeButton.onclick = () => {
  const isLight = document.body.classList.contains('light');
  const newTheme = isLight ? 'dark' : 'light';
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

const createArticleCard = (a, i) => {
  const minutes = Math.ceil(a.wordCount / 200);
  return `
    <div class="col-md-4">
      <div class="card shadow-sm border-0 h-100 article-card" data-index="${i}">
        <img src="${a.image}" class="card-img-top" alt="Image">
        <div class="card-body d-flex flex-column">
          <div class="mb-2"><span class="badge badge-category ${getBadgeColor(a.category)}">${a.category}</span></div>
          <h5 class="card-title">${a.title}</h5>
          <h6 class="card-subtitle mb-2 views-meta">${a.date}</h6>
          <p class="card-text">${a.content.slice(0, 120)}...</p>
          <p class="mt-auto views-meta">Views: ${a.views} · ${minutes} min read</p>
          <a href="#" class="btn btn-sm btn-read">Read more</a>
        </div>
      </div>
    </div>`;
};

const renderAllArticles = () => {
  articlesContainer.innerHTML = allArticles.map((a, i) => createArticleCard(a, i)).join('');

  document.querySelectorAll('.article-card').forEach(card => {
    const i = +card.dataset.index;
    card.onclick = () => {
      allArticles[i].views++;
      sortDropdown.value = 'views';
      sortAndRenderArticles();
    };
    card.querySelector('.btn-read').onclick = e => {
      e.stopPropagation();
      const article = allArticles[i];
      document.getElementById('modal-title').textContent = article.title;
      document.getElementById('modal-body').textContent = article.content;
      document.getElementById('modal-meta').textContent = `${article.date} • ${article.category} • ${article.wordCount} words`;
      new bootstrap.Modal(document.getElementById('articleModal')).show();
    };
  });
};

const renderMostPopularArticle = () => {
  const top = allArticles.reduce((a, b) => a.views > b.views ? a : b);
  const minutes = Math.ceil(top.wordCount / 200);
  featuredContainer.innerHTML = `
    <img src="${top.image}" class="card-img-top" alt="Popular">
    <div class="card-body">
      <div class="mb-2"><span class="badge badge-category ${getBadgeColor(top.category)}">${top.category}</span></div>
      <h5 class="card-title">${top.title}</h5>
      <p class="card-text">${top.content.slice(0, 150)}...</p>
      <p class="views-meta">Views: ${top.views} · ${minutes} min read</p>
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
