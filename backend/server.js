const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./student.db");

// CREATE TABLE

db.run(`
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    regno TEXT,
    name TEXT,
    age INTEGER,
    dob TEXT,
    email TEXT,
    phone TEXT,
    department TEXT,
    gender TEXT,
    studentType TEXT
)
`);
// GET ALL STUDENTS
app.get("/students", (req, res) => {

    db.all("SELECT * FROM students", [], (err, rows) => {

        if (err) {
            res.status(500).json(err);
        } else {
            res.json(rows);
        }
    });
});

// ADD STUDENT
app.post("/students", (req, res) => {

    const {
        regno,
        name,
        age,
        dob,
        email,
        phone,
        department,
        gender,
        studentType
    } = req.body;

    db.run(
        `INSERT INTO students
        (regno, name, age, dob, email, phone, department, gender, studentType)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            regno,
            name,
            age,
            dob,
            email,
            phone,
            department,
            gender,
            studentType
        ],
        function(err) {

            if (err) {
                res.status(500).json(err);
            } else {

                res.json({
                    id: this.lastID
                });
            }
        }
    );
});

// UPDATE STUDENT
app.put("/students/:id", (req, res) => {

    const { id } = req.params;

    const {
        regno,
        name,
        age,
        dob,
        email,
        phone,
        department,
        gender,
        studentType
    } = req.body;

    db.run(
        `UPDATE students SET
        regno=?,
        name=?,
        age=?,
        dob=?,
        email=?,
        phone=?,
        department=?,
        gender=?,
        studentType=?
        WHERE id=?`,
        [
            regno,
            name,
            age,
            dob,
            email,
            phone,
            department,
            gender,
            studentType,
            id
        ],
        function(err) {

            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    message: "Updated"
                });
            }
        }
    );
});
// DELETE STUDENT
app.delete("/students/:id", (req, res) => {

    const { id } = req.params;

    db.run(
        "DELETE FROM students WHERE id=?",
        [id],
        function(err) {

            if (err) {
                res.status(500).json(err);
            } else {
                res.json({
                    message: "Student Deleted"
                });
            }
        }
    );
});
const port=process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Server running on port ${port}");
});