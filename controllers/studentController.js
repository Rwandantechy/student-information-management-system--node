const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("student-db.sqlite");

// Route handler to list all students
exports.listStudents = (req, res) => {
  db.all("SELECT * FROM students", (err, students) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (students.length === 0) {
      // Handle the case where no students are found
      res.status(404).send("No Students Found");
      return;
    }

    res.render("studentsview", { students });
  });
};

// Route handler to create a new student
exports.createStudent = (req, res) => {
  // Extract student data from req.body and insert it into the SQLite database
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    address,
    city,
    state,
    zipcode,
    email,
    phone_number,
    guardian_name,
    guardian_phone,
  } = req.body;

  const stmt = db.prepare(
    "INSERT INTO students (first_name, last_name, gender, date_of_birth, address, city, state, zipcode, email, phone_number, guardian_name, guardian_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );

  stmt.run(
    [
      first_name,
      last_name,
      gender,
      date_of_birth,
      address,
      city,
      state,
      zipcode,
      email,
      phone_number,
      guardian_name,
      guardian_phone,
    ],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }

      res.redirect("/sims/all");
    }
  );

  stmt.finalize();
};

//delete student from database
exports.deleteStudent = (req, res) => {
  const id = req.params.id;

  const stmt = db.prepare("DELETE FROM students WHERE id = ?");

  stmt.run([id], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    res.redirect("/sims/all");
  });

  stmt.finalize();
};

// Route handler to update a student by ID
exports.updateStudent = (req, res) => {
  const studentId = req.params.id;

  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    address,
    city,
    state,
    zipcode,
    email,
    phone_number,
    guardian_name,
    guardian_phone,
  } = req.body;

  // Begin a transaction
  db.run("BEGIN TRANSACTION", function (beginErr) {
    if (beginErr) {
      console.error(beginErr);
      res.status(500).send("Internal Server Error");
      return;
    }

    const stmt = db.prepare(
      "UPDATE students SET first_name = ?, last_name = ?, gender = ?, date_of_birth = ?, address = ?, city = ?, state = ?, zipcode = ?, email = ?, phone_number = ?, guardian_name = ?, guardian_phone = ? WHERE id = ?"
    );

    stmt.run(
      first_name,
      last_name,
      gender,
      date_of_birth,
      address,
      city,
      state,
      zipcode,
      email,
      phone_number,
      guardian_name,
      guardian_phone,
      studentId,
      (err) => {
        if (err) {
          console.error(err);
          // Rollback the transaction in case of an error
          db.run("ROLLBACK", (rollbackErr) => {
            if (rollbackErr) {
              console.error(rollbackErr);
            }
            res.status(500).send("Internal Server Error");
          });
        } else {
          // Commit the transaction
          db.run("COMMIT", (commitErr) => {
            if (commitErr) {
              console.error(commitErr);
              res.status(500).send("Internal Server Error");
            } else {
              console.log("Student updated successfully.");
              res.redirect("/sims/all");
            }
          });
        }
      }
    );

    stmt.finalize();
  });
};

// Route handler to find a student by ID
exports.findStudent = (req, res) => {
  const studentId = req.params.id;

  db.get("SELECT * FROM students WHERE id = ?", [studentId], (err, student) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    if (!student) {
      // Handle the case where the student with the given ID is not found
      res.status(404).send("Student Not Found");
      return;
    }
    res.render("student", { student });
  });
};
