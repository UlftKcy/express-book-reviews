const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(400).json({ message: "Username already exists!" });
    }
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  /* res.send(JSON.stringify(books, null, 4)); */

  let getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books available");
    }
  });
  getBooks.then((books) => res.send(JSON.stringify(books, null, 4)));
  getBooks.catch((err) => res.send(err));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const filteredBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const filteredBooks = Object.values(books).filter(
    (book) => book.title === title
  );
  if (filteredBooks.length > 0) {
    res.send(JSON.stringify(filteredBooks, null, 4));
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.send(JSON.stringify(book.reviews, null, 4));
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get the book details based on ISBN (Promise)
public_users.get("/isbn", async (req, res) => {
  const isbn = req.query.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    res.send(JSON.stringify(book, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get book details based on author (Promise)
public_users.get("/author", async (req, res) => {
  const author = req.query.author;
  try {
    const filteredBooks = await new Promise((resolve, reject) => {
      const results = Object.values(books).filter(
        (book) => book.author === author
      );
      if (results.length > 0) resolve(results);
      else reject("Author not found");
    });
    res.send(JSON.stringify(filteredBooks, null, 4));
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

// Get all books based on title (Promise)
public_users.get("/title", async (req, res) => {
  const title = req.query.title;

  try {
    const filteredBooks = await new Promise((resolve, reject) => {
      const results = Object.values(books).filter(
        (book) => book.title === title
      );
      if (results.length > 0) resolve(results);
      else reject("Title not found");
    });
    res.send(JSON.stringify(filteredBooks, null, 4));
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports.general = public_users;
