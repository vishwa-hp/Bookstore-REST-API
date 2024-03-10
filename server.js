const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware to parse JSON body

app.use(bodyParser.json());


// Read books data from JSON file
let books = JSON.parse(fs.readFileSync('books.json'));


// GET all books
app.get('/books', (req, res) => {
    res.json(books);
});

// GET a specific book by ID
app.get('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(book => book.id === bookId);
    if (book) {
        res.json(book);
    } else {
        res.status(404).send('Book not found');
    }
});

// POST a new book
app.post('/books', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.status(201).json(newBook);
});

// PUT/update a book by ID
app.put('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const updatedBook = req.body;
    const index = books.findIndex(book => book.id === bookId);
    if (index !== -1) {
        books[index] = updatedBook;
        fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
        res.json(updatedBook);
    } else {
        res.status(404).send('Book not found');
    }
});

// DELETE a book by ID
app.delete('/books/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    books = books.filter(book => book.id !== bookId);
    fs.writeFileSync('books.json', JSON.stringify(books, null, 2));
    res.status(204).send();
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
