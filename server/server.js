const express = require("express");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mysql = require("mysql");
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const port = 3000;

// MySQL connection
const connection = mysql.createConnection({
  connectionLimit : 100,
  host: "localhost",
  user: "root",
  password: "12345qwert",
  database: "online_shop",
  charset: 'utf8mb4',
  port: 3306
});
app.use(fileUpload({
  defCharset: 'utf8',
  defParamCharset: 'utf8'
}));
app.use(session({
  secret: 'secret',
  resave: false,
  cookie: {maxAge: 60 * 60 * 1000 }, // 1hours
  saveUninitialized: true
}));
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to database with ID " + connection.threadId);
});

app.use(express.static(path.join(__dirname, "../public")));
app.use('/images', express.static(path.join(__dirname, '../db/images')));
app.use(bodyParser.json()); // For parsing application/json
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

function updateProd(prods){
  let sql = 'UPDATE products SET quantity = ? WHERE id = ?';
  const products = JSON.parse(prods);
  products.forEach(product => {
    let data = [product.quantity - product.count, product.id];
    connection.query(sql, data, (error, results) => {
      if (error) throw error;
    });
  });
}

// Optional: Define a root route (can redirect to 'index.html')
app.get("/", (req, res) => {
  res.redirect("/index.html");
});

app.post('/api/auth', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === 'admin' && password === 'admin'){
    req.session.authenticated = true;
    req.session.username = username;
    res.json({id: req.sessionID, username: username, rule: true});
    return;
  }

  connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      req.session.authenticated = true;
      req.session.username = username;
      res.json({ id: req.sessionID, username : username, rule: false });
    } else {
      res.status(400).json({ id: null});
    }
  });
});

// Route to get all categories
app.get('/api/categories', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  connection.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});
app.get('/api/orders', (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  connection.query('SELECT * FROM orders', (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json(results);
  });
});
// Route to get subcategories by category
app.get('/api/subcategories', (req, res) => {
  let query;
  if (req.query.category){
    const {category}  = req.query;
    query = 'SELECT * FROM subcategories WHERE category_id = ?';
    connection.query(query, [category], (error, results) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.json(results);
    });
  }
  else {
    query = 'SELECT * FROM subcategories';
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).send(error);
        return;
      }
      res.json(results);
    });
  }
});
// Route to get products by subcategory
app.get('/api/products', (req, res) => {
  let query = 'SELECT * FROM products';
  const subcategory = req.query.subcategory;

  if (subcategory) {
    query += ' WHERE subcategory_id = ' + mysql.escape(subcategory);
  }

  connection.query(query, (error, results) => {
    if (error) res.status(500).send(error);
    res.json(results);
  });
});

// Маршрут для регистрации пользователя
app.post('/api/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Проверка на существование пользователя
  connection.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.send('Пользователь с таким логином уже существует!');
    } else {
      // Добавление пользователя в базу данных
      connection.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
        if (err) throw err;
        res.send('Пользователь успешно зарегистрирован!');
      });
    }
  });
});
// Маршрут для добавления заказа
app.post('/api/addOrder', (req, res) => {
  const sql = 'INSERT INTO orders (products, fullname, phone, address, paymentMethod) VALUES (?, ?, ?, ?, ?)';
  const values = [req.body.products, req.body.fullname, req.body.phone, req.body.address, req.body.paymentMethod];
  connection.query(sql, values, (err, result) => {
    if (err) {
      res.json(false);
    } else {
      updateProd(req.body.products);//удаляем из списка товаров купленные
      res.json(true);
    }
  });
});
async function checkCategory(category) {
  const query = 'SELECT DISTINCT * FROM categories WHERE name = ?';
  const params = [category];
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
async function checkSubcategory(subcategoryId, subcategoryName) {
  const query = `SELECT DISTINCT id FROM subcategories WHERE category_id = ${subcategoryId} AND name = '${subcategoryName}'`;
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}
function addCategory(name){
  const query = 'INSERT INTO categories (name) VALUES (?)';
  connection.query(query, [name], (error, result) => {
      if (error) return error;
      return result;
  });
}
function addSubcategoryAndProduct(prodData){
  const queryCat = 'SELECT id FROM categories WHERE name = ?';
  const query = 'INSERT INTO subcategories (name, category_id) VALUES (?, ?)';
  connection.query(queryCat, [prodData.category], (error, resultCat) => { //выбираем id категории
    if (error) console.error(error);
    connection.query(query, [prodData.subcategory, resultCat[0].id], (error, resultSubcat) => { //добавляем подкатегорию по категории
      if (error) console.error(error);
      //console.log(resultSubcat.insertId);
      const query = 'INSERT INTO products (name, subcategory_id, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)';
      connection.query(query, [prodData.name, resultSubcat.insertId, prodData.description, prodData.price, prodData.quantity, prodData.image], (error) => {
          if (error) console.error(error);
          console.log("supplies added");
        });
    });
  });
}
// Route to create a new product
app.post('/api/products', async (req, res) => {
  const prodData = {
    name:req.body.name,
    category:req.body.category,
    subcategory:req.body.subcategory,
    description:req.body.description,
    price:req.body.price,
    quantity:req.body.quantity,
    image:req.body.image
  }
  let isEmpty = Object.values(JSON.parse(JSON.stringify(await checkCategory(prodData.category))));
  try{
    if (isEmpty[0] !== undefined) {
      let isEmptySubcat = Object.values(JSON.parse(JSON.stringify(await checkSubcategory(isEmpty[0].id, prodData.subcategory))));
      if (isEmptySubcat[0] === undefined){
        addSubcategoryAndProduct(prodData);
      }else {
        const query = 'SELECT subcategories.id AS subcategory_id FROM subcategories JOIN categories ON' +
          ` subcategories.category_id = categories.id WHERE subcategories.name = '${prodData.subcategory}' AND categories.name = '${prodData.category}'`;
        connection.query(query, (error, result) => { //добавляем подкатегорию по категории
          if (error) console.error(error);
          const query = 'INSERT INTO products (name, subcategory_id, description, price, quantity, image_url) VALUES (?, ?, ?, ?, ?, ?)';
          connection.query(query, [prodData.name, result[0].subcategory_id, prodData.description, prodData.price, prodData.quantity, prodData.image], (error) => {
            if (error) console.error(error);
            console.log("supplies added");
          });
        });
      }
  } else {
      addCategory(prodData.category);
      addSubcategoryAndProduct(prodData);
  }
  }catch (err){
    console.error('Ошибка при выполнении запроса:', err);
    res.send("Произошла ошибка. Проверьте форму.");
  }
});
app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const image = req.files.image;
  const uploadPath = path.join(__dirname,'../db/images/', image.name);
  image.mv(uploadPath, function(err) {
    if (err) {
      return res.status(500).send(err);
    }
    res.send('Image uploaded!');
  });
});
// Route to update a product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, price, quantity } = req.body;
  const query = 'UPDATE products SET name = ?, description = ?, price = ?, quantity = ? WHERE id = ?';

  connection.query(query, [name, description, price, quantity, id], (error, results) => {
      if (error) {
          res.status(500).send(error);
          return;
      }
      res.json({ message: 'Product updated successfully' });
  });
});

// Route to delete a product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM products WHERE id = ?';

  connection.query(query, [id], (error, results) => {
      if (error) {
          res.status(500).send(error);
          return;
      }
      res.json({ message: 'Product deleted successfully' });
  });
});

app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM orders WHERE id = ?';

  connection.query(query, [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
      return;
    }
    res.json({ message: 'Product deleted successfully' });
  });
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
