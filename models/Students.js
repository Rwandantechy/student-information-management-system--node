const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('student-db.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      gender TEXT,
      date_of_birth DATE,
      address TEXT,
      city TEXT,
      state TEXT,
      zipcode TEXT,
      email TEXT,
      phone_number TEXT,
      guardian_name TEXT,
      guardian_phone TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Error creating the 'students' table:", err.message);
    } else {
      console.log("Table 'students' created successfully.");
    }
  });
});

db.close((err) => {
  if (err) {
    console.error("Error closing the database:", err.message);
  } else {
    console.log("Database closed.");
  }
});
