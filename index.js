const express = require("express");
const app = express();
const studentsRoutes = require("./routes/students.js");
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set("view engine", "ejs");
// Set "Cache-Control" header to prevent caching for all responses in your application
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

// Middleware to parse URL-encoded bodies (for form data)
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Use the "students" routes
app.use("/sims", studentsRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
