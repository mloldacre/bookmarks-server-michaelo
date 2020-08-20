const testParam = {
  'id': 'TestOneID',
  'title': 'TestOne',
  'url': 'www.test.com',
  'description': 'Test',
  'rating': 1
};

const badTestParam = {
  'id': 'TestBadID',
  'url': 'www.test.com',
  'description': 'Test',
  'rating': 1
};

const testStore = [{
  'id': 'TestOneID',
  'title': 'TestOne',
  'url': 'www.testOne.com',
  'description': 'TestOne',
  'rating': 1
},
{
  'id': 'TestTwoID',
  'title': 'TestTwo',
  'url': 'www.testTwo.com',
  'description': 'TestTwo',
  'rating': 2
},
{
  'id': 'TestThreeID',
  'title': 'TestThree',
  'url': 'www.testThree.com',
  'description': 'TestThree',
  'rating': 3
}];

module.exports ={ testStore, testParam, badTestParam };