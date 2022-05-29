const axios = require('axios');

export default async function fetchImages(searchName, page = 1, perPage = 40) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY_API = '27625632-25685d1490259d6854a924975';
  const generalURL = `${BASE_URL}?key=${KEY_API}&q=${searchName}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;
  const data = await axios.get(generalURL);
  console.log(data.data.total);
  return data.data;
}
