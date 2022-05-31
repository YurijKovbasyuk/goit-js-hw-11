import './sass/main.scss';
import fetchImages from './fetchImages';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// const InfiniteScroll = require('infinite-scroll');

const formEl = document.querySelector('form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
const perPage = 40;
let searchName;

const renderMarkup = data => {
  console.log(data);
  const markup = data.hits
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p><p class="info-item"><b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p></div></a></div>`).join();
  galleryEl.insertAdjacentHTML('beforeend', markup);
  const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

const onLoad = async e => {
  e.preventDefault();
  page = 1;
  galleryEl.innerHTML = '';
  searchName = formEl.elements.searchQuery.value;
  const data = await fetchImages(searchName, page, perPage);

  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );

    loadMoreBtn.style.display = 'none';
    return;
  }
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images`);
  loadMoreBtn.style.display = 'flex';
  console.log(data);
  renderMarkup(data);
};

const onLoadMore = async () => {
  searchName = formEl.elements.searchQuery.value;
  const data = await fetchImages(searchName, ++page, perPage);
  if (data.hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
    );
    loadMoreBtn.style.display = 'none';
    return;
  }

  if (data.hits.length < 40) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
  renderMarkup(data);
};

formEl.addEventListener('submit', onLoad);
loadMoreBtn.addEventListener('click', onLoadMore);
