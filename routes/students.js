const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Render the form for creating a student
router.get("/form", (req, res) => {
  res.render("form", { title: "Create Student" });
});

// Route for all students page
router.get("/all", studentController.listStudents);

// Add a route for creating new students
router.post("/create", studentController.createStudent);

// Add a route for updating a student using PUT
router.post("/:id/update", studentController.updateStudent);

// Add a route for deleting a student by id using DELETE
router.post("/:id/delete", studentController.deleteStudent);

// Add a route for finding a student by id
router.get("/:id", studentController.findStudent);

module.exports = router;
