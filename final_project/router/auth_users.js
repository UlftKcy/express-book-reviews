const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => user.username === username);
  return user ? true : false;
};

const authenticatedUser = (username, password) => {
  const validUser = users.find(
    (user) => user.username === username && user.password === password
  );
  return validUser ? true : false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(404).json({ message: "Please enter username and password" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        username: username,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res
      .status(401)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username;

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).json({
      message: "Review added/updated successfully",
      reviews: books[isbn].reviews,
    });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({
        message: "Review deleted successfully",
        reviews: books[isbn].reviews,
      });
    } else {
      return res.status(404).json({ message: "Review not found for user" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
