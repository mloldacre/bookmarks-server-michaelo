

function makeBookmarks() {
  return [
    {
      id: 1,
      title: 'Thinkful',
      url: 'https://www.thinkful.com',
      description: 'Think outside the classroom',
      rating: 1
    },
    {
      id: 2,
      title: 'Bing',
      url: 'https://www.bing.com',
      description: 'Where we find everything else - MS',
      rating: 2
    },
    {
      id: 3,
      title: 'MDN',
      url: 'https://developer.mozilla.org',
      description: 'The only place to find web documentation',
      rating: 3
    },
    {
      id: 4,
      title: 'Yahoo',
      url: 'https://www.yahoo.com',
      description: 'Yahooooooooooooo!',
      rating: 4
    },
    {
      id: 5,
      title: 'Amazon',
      url: 'https://www.amazon.com',
      description: 'This used to be a bookstore',
      rating: 5
    },
  ];
}

const testParam = {
  'id': 1,
  'title': 'Thinkful',
  'url': 'https://www.thinkful.com',
  'description': 'Think outside the classroom',
  'rating': 1
};

const badTestParam = {
  'id': 10,
  'url': 'www.bad.com',
  'description': 'Wrong',
  'rating': 1
};

module.exports = { makeBookmarks, testParam, badTestParam };