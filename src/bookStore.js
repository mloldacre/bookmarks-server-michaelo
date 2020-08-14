const { v4: uuid } = require('uuid');

const bookmarks = [
  {
    id: uuid(),
    title: 'Thinkful',
    url: 'https://www.thinkful.com',
    description: 'Think outside the classroom',
    rating: 5
  },
  {
    id: uuid(),
    title: 'Bing',
    url: 'https://www.bing.com',
    description: 'Where we find everything else - MS',
    rating: 4
  },
  {
    id: uuid(),
    title: 'MDN',
    url: 'https://developer.mozilla.org',
    description: 'The only place to find web documentation',
    rating: 5
  },
];

module.exports = { bookmarks };