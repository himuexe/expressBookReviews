const express = require('express');
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

public_users.post("/register", (req,res) => {

  //Write your code here
   try{
    let username = req.body.username; 
    let password = req.body.password;
    if (!username || !password) {
      return res.status(404).json({ message: "Error registering user" });
    }
    if (doesExist(username)) {
      return res.status(208).json({ message: "User already exists" });
    } else {
      let newUser = {
        username: username,
        password: password
      }
      users.push(newUser);
      return res.status(200).json({ message: "User successfully registered" });
    }
  }
  catch(err){
    return res.status(300).json({message: "Internal Server Error"});
  }
    
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
      // Simulate an async operation using a Promise
      const booksList = await new Promise((resolve) => {
          resolve(Object.values(books)); // Resolve with the list of books
      });
      return res.status(200).json({ message: "List of books", books: booksList });
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
      // Simulate an async operation using a Promise
      const book = await new Promise((resolve) => {
          resolve(books[isbn]); // Resolve with the book details
      });

      if (book) {
          return res.status(200).json({ message: "Book found", book });
      } else {
          return res.status(404).json({ message: "Book not found" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching book details", error: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
      // Simulate an async operation using a Promise
      const booksByAuthor = await new Promise((resolve) => {
          const filteredBooks = Object.values(books).filter((book) =>
              book.author.toLowerCase().includes(author.toLowerCase())
          );
          resolve(filteredBooks); // Resolve with books by the author
      });

      if (booksByAuthor.length > 0) {
          return res.status(200).json({ message: "Books found", books: booksByAuthor });
      } else {
          return res.status(404).json({ message: "No books found for this author" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
      // Simulate an async operation using a Promise
      const booksByTitle = await new Promise((resolve) => {
          const filteredBooks = Object.values(books).filter((book) =>
              book.title.toLowerCase().includes(title.toLowerCase())
          );
          resolve(filteredBooks); // Resolve with books by the title
      });

      if (booksByTitle.length > 0) {
          return res.status(200).json({ message: "Books found", books: booksByTitle });
      } else {
          return res.status(404).json({ message: "No books found with this title" });
      }
  } catch (error) {
      return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try{
    let isbn = req.params.isbn;
    let book = books[isbn];
    if(book.reviews.length>0){
      return res.status(200).send(JSON.stringify(book.reviews));
    }
    else{
      return res.status(404).json({message:"No reviews found for the book"});
    }
  }
  catch(err){
    return res.status(300).json({message: "Internal Server Error"});
  }
});

module.exports.general = public_users;
