const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });

});

public_users.get('/', function (req, res) {
  const books_to_display = JSON.stringify(books)
  return res.status(300).send(books_to_display);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const book_params = req.params.isbn
  const book_by_isbn = books[book_params]
  return res.status(300).send(book_by_isbn);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author_params = req.params.author
  const book_by_author = Object.values(books).filter((book) => {
    return book.author === author_params;
  });
  return res.status(300).send(book_by_author);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title_params = req.params.title
  const book_by_title = Object.values(books).filter((book) => {
    return book.title === title_params;
  });
  return res.status(300).send(book_by_title);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const review_isbn = req.params.isbn
  const book = books[review_isbn].reviews
  return res.status(300).send(book);
});

module.exports.general = public_users;
