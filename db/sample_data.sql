USE online_shop;
SET NAMES utf8mb4;

INSERT INTO categories (name) VALUES
('Чехлы'),
('Наушники'),
('Защитные стёкла');

INSERT INTO subcategories (name, category_id) VALUES
('Samsung', 1),
('IPhone', 1),
('Беспроводные', 2),
('Проводные', 2),
('Samsung', 3),
('IPhone', 3);

INSERT INTO products (name, subcategory_id, description, price, quantity, image_url) VALUES
('Защитное стекло для iPhone 12', 6, 'Прочное стекло для защиты экрана iPhone 12', 1000, 3, 'Glass iPhone 12.jpg'),
('Защитное стекло для iPhone 14', 6, 'Стекло для надежной защиты экрана iPhone 14', 1100, 3, 'Protective Glass iPhone 14.jpg'),
('AirPods Pro', 3, 'Наушники Apple AirPods Pro с шумоподавлением', 20000, 2, 'Apple AirPods Pro Headphones.jpg'),
('Чехол для iPhone 14', 2, 'Изящный чехол для iPhone 14', 1500, 12, 'Case for iPhone 14.jpg'),
('Проводные наушники', 4, 'Классические проводные наушники', 500, 7, 'Wired Headphones.jpg'),
('Защитное стекло для iPhone 15', 6, 'Защитное стекло для экрана iPhone 15', 1200, 1, 'Protective Glass iPhone 15.jpg'),
('Чехол для iPhone 12', 2, 'Защитный чехол для iPhone 12', 1400, 5, 'Case for iPhone 12.jpg'),
('Чехол для iPhone 15', 2, 'Стильный чехол для iPhone 15', 1600, 6, 'Case for iPhone 15.jpg'),
('Защитное стекло для iPhone 13', 6, 'Стекло для защиты экрана iPhone 13', 1050, 2, 'Protective Glass iPhone 13.jpg'),
('AirPods', 3, 'Наушники Apple AirPods', 18000, 0, 'Apple AirPods Headphones.jpg'),
('Чехол для iPhone 13', 2, 'Чехол для iPhone 13 с защитой от ударов', 1450, 5, 'Case for iPhone 13.jpg');
