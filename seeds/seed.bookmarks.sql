-- insert some test data
-- Using a multi-row insert statement here
INSERT INTO
  bookmarks (title, url, description, rating)
VALUES
  ('Title One', 'www.one.com', 'Test One', '1'),
  ('Title Two', 'www.two.com', 'Test Two', '2'),
  (
    'Title Three',
    'www.three.com',
    'Test Three',
    '3'
  ),
  ('Title Four', 'www.four.com', 'Test Four', '4'),
  ('Title Five', 'www.five.com', 'Test Five', '5'),
  ('Title Six', 'www.six.com', 'Test Six', '1'),
  (
    'Title Seven',
    'www.seven.com',
    'Test Seven',
    '2'
  ),
  (
    'Title Eight',
    'www.eight.com',
    'Test Eight',
    '3'
  ),
  ('Title Nine', 'www.nine.com', 'Test Nine', '4'),
  ('Title Ten', 'www.ten.com', 'Test Ten', '5');