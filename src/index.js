import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const imgContainer = document.querySelector('.gallery');
const searchForm = document.getElementById('search-form');
const searchInput = document.querySelector('input[type=text]');
const loadMoreBtn = document.getElementById('load-more');
let currentPage = 1;

searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.addEventListener('click', loadMore);
imgContainer.addEventListener('scroll', update);

const galleryIMG = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function onSearchForm(e) {
  e.preventDefault();
  const getValue = searchInput.value;
  if (getValue === '') {
    Notiflix.Notify.failure('Enter something.');
    return;
  }

  currentPage = 1;
  search(getValue, currentPage);
}
function renderImg(data) {
  update();
  console.log(data.data);
  imgContainer.innerHTML = '';
  let markup;
  markup = data.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
  <div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" title="${tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <br>${likes}
    </p>
    <p class="info-item">
      <b>View</b> <br>${views}
    </p>
    <p class="info-item">
      <b>Comments</b> <br>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br> ${downloads}
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  imgContainer.innerHTML = markup;

  loadMoreBtn.style = 'display: block';
}

async function search(query, page) {
  await axios({
    url: 'https://pixabay.com/api/',
    params: {
      key: '34913875-a3fb3e83b61c48d3709723712',
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 40,
      page: page,
    },
  })
    .then(data => renderImg(data))
    .catch(err => console.log(err));
}

function loadMore() {
  currentPage++;
  lightbox.refresh();
  let value = searchInput.value;
  search(value, currentPage);
  update();
}

function update() {
  const { height: cardHeight } =
    imgContainer.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
