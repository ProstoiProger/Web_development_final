// get all the articles from the articles.js file 
let allArticles = data.articles;

// get all the elements we need from the page
const themeButton = document.getElementById('theme-toggle');
const sortDropdown = document.getElementById('sort-select');
const articlesContainer = document.getElementById('news-container');
const featuredContainer = document.getElementById('popular-article');

// set initial theme based on what's saved in localStorage
document.body.className = localStorage.getItem('theme') || 'light';
themeButton.textContent = document.body.classList.contains('light') ? '🌞' : '🌜';

// handle theme switching when user clicks the button
themeButton.onclick = () => {
  const isLight = document.body.classList.contains('light');
  const newTheme = isLight ? 'dark' : 'light';
  document.body.className = newTheme;
  localStorage.setItem('theme', newTheme); // save new theme
  themeButton.textContent = newTheme === 'light' ? '🌞' : '🌜';
};

// category to badge color mapping
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

// get color class based on category name
const getBadgeColor = cat => categoryColors[cat] || 'badge-secondary';

// function to create the HTML for 1 article card
const createArticleCard = (a, i) => {
  const minutes = Math.ceil(a.wordCount / 200); // estimate reading time
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

// function to display all article cards
const renderAllArticles = () => {
  // fill the container with cards
  articlesContainer.innerHTML = allArticles.map((a, i) => createArticleCard(a, i)).join('');

  // make cards interactive
  document.querySelectorAll('.article-card').forEach(card => {
    const i = +card.dataset.index;

    // clicking the whole card increases views
    card.onclick = () => {
      allArticles[i].views++;
      sortDropdown.value = 'views'; // change dropdown to "popular"
      sortAndRenderArticles(); // re-render everything
    };

    // clicking only the "Read more" opens modal
    card.querySelector('.btn-read').onclick = e => {
      e.stopPropagation(); // don't trigger card click
      const article = allArticles[i];

      // fill modal with full article info
      document.getElementById('modal-title').textContent = article.title;
      document.getElementById('modal-body').textContent = article.content;
      document.getElementById('modal-meta').textContent =
        `${article.date} • ${article.category} • ${article.wordCount} words`;

      // open the modal (Bootstrap)
      new bootstrap.Modal(document.getElementById('articleModal')).show();
    };
  });
};

// show the most viewed article in special section
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

// this function sorts articles (by date or views) and re-renders
const sortAndRenderArticles = () => {
  const sortBy = sortDropdown.value;
  allArticles.sort((a, b) =>
    sortBy === 'views'
      ? b.views - a.views
      : new Date(b.date) - new Date(a.date)
  );
  renderAllArticles();
  renderMostPopularArticle();
};

// when user changes sort option
sortDropdown.onchange = sortAndRenderArticles;

// run once when page loads
sortAndRenderArticles();
