const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return username && username.trim().length > 0;
};

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    return !!user;
};

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        // Store username in session
        req.session.username = username;
        return res.status(200).json({ message: "User successfully logged in" });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.query; // Get review from query parameter
    const username = req.session.username; // Get username from session

    if (!review) {
        return res.status(400).json({ message: "Review is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if it doesn't exist
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or update the review for the book
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review added/updated successfully", book: books[isbn] });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Get ISBN from URL parameters
    const username = req.session.username; // Get username from session

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews || !books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review for the current user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted successfully", book: books[isbn] });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;