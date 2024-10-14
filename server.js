const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Setup View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (CSS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',   // Sesuaikan dengan user MySQL kamu
    password: '',   // Sesuaikan dengan password MySQL kamu
    database: 'crud_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL');
});

// 1. READ - Tampilkan semua user
app.get('/', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('index', { users: results });
    });
});

// 2. CREATE - Tampilkan form tambah user
app.get('/create', (req, res) => {
    res.render('create');
});

// 2. CREATE - Proses tambah user baru
app.post('/create', (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'INSERT INTO users (name, email, phone) VALUES (?, ?, ?)';
    db.query(sql, [name, email, phone], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 3. UPDATE - Tampilkan form edit user
app.get('/edit/:id', (req, res) => {
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { user: result[0] });
    });
});

// 3. UPDATE - Proses update user
app.post('/edit/:id', (req, res) => {
    const { name, email, phone } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?';
    db.query(sql, [name, email, phone, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// 4. DELETE - Hapus user
app.get('/delete/:id', (req, res) => {
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
