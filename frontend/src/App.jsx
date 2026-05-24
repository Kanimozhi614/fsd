import { useEffect, useState } from "react";

function App() {

    const [students, setStudents] = useState([]);

    const [page, setPage] = useState("form");

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({
        regno: "",
        name: "",
        age: "",
        dob: "",
        email: "",
        phone: "",
        department: "CSE",
        gender: "Male",
        studentType: "Dayscholar"
    });

    const [editingId, setEditingId] = useState(null);

    const fetchStudents = async () => {

        const res = await fetch("https://fsd2-pym7.onrender.com/students");

        const data = await res.json();

        setStudents(data);
    };

    useEffect(() => {

        fetchStudents();

    }, []);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {

        if (!formData.regno.trim()) {

            alert("Register Number required");

            return false;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(formData.email)) {

            alert("Invalid Email");

            return false;
        }

        const phonePattern = /^[0-9]{10}$/;

        if (!phonePattern.test(formData.phone)) {

            alert("Phone must be 10 digits");

            return false;
        }

        return true;
    };

    const handleSubmit = async () => {

        if (!validateForm()) return;

        if (editingId) {

            await fetch(`https://fsd2-pym7.onrender.com/students/${editingId}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)
            });

        } else {

            await fetch("https://fsd2-pym7.onrender.com/students", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(formData)
            });
        }

        setFormData({
            regno: "",
            name: "",
            age: "",
            dob: "",
            email: "",
            phone: "",
            department: "CSE",
            gender: "Male",
            studentType: "Dayscholar"
        });

        setEditingId(null);

        fetchStudents();

        setPage("records");
    };

    const deleteStudent = async (id) => {

        await fetch(`https://fsd2-pym7.onrender.com/students/${id}`, {

            method: "DELETE"
        });

        fetchStudents();
    };

    const editStudent = (student) => {

        setEditingId(student.id);

        setFormData(student);

        setPage("form");
    };

    const filteredStudents = students.filter((student) =>

        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.regno.toLowerCase().includes(search.toLowerCase())
    );

    return (

        <div style={mainContainer}>

            {/* SIDEBAR */}

            <div style={sidebar}>

                <h2>SMS</h2>

                <button
                    style={menuBtn}
                    onClick={() => setPage("form")}
                >
                    Add Student
                </button>

                <button
                    style={menuBtn}
                    onClick={() => setPage("records")}
                >
                    Student Records
                </button>

            </div>

            {/* CONTENT */}

            <div style={content}>

                {
                    page === "form" && (

                        <div style={formBox}>

                            <h2>
                                {
                                    editingId
                                        ? "Update Student"
                                        : "Add Student"
                                }
                            </h2>

                            <input
                                type="text"
                                name="regno"
                                placeholder="Register Number *"
                                value={formData.regno}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleChange}
                                style={input}
                            />

                            <input
                                type="text"
                                name="department"
                                placeholder="Department"
                                value={formData.department}
                                onChange={handleChange}
                                style={input}
                            />

                            <div style={radioBox}>

                                <label>

                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="Dayscholar"
                                        checked={
                                            formData.studentType === "Dayscholar"
                                        }
                                        onChange={handleChange}
                                    />

                                    Dayscholar

                                </label>

                                <label>

                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="Hosteller"
                                        checked={
                                            formData.studentType === "Hosteller"
                                        }
                                        onChange={handleChange}
                                    />

                                    Hosteller

                                </label>

                            </div>

                            <button
                                style={submitBtn}
                                onClick={handleSubmit}
                            >

                                {
                                    editingId
                                        ? "Update"
                                        : "Add"
                                }

                            </button>

                        </div>
                    )
                }

                {
                    page === "records" && (

                        <div>

                            <h2>Student Records</h2>

                            <input
                                type="text"
                                placeholder="Search by name or reg no"
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={searchInput}
                            />

                            <table style={table}>

                                <thead>

                                    <tr>

                                        <th>Reg No</th>
                                        <th>Name</th>
                                        <th>Dept</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Type</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {
                                        filteredStudents.map((student) => (

                                            <tr key={student.id}>

                                                <td>{student.regno}</td>

                                                <td>{student.name}</td>

                                                <td>{student.department}</td>

                                                <td>{student.email}</td>

                                                <td>{student.phone}</td>

                                                <td>{student.studentType}</td>

                                                <td>

                                                    <button
                                                        onClick={() =>
                                                            editStudent(student)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteStudent(student.id)
                                                        }
                                                        style={{
                                                            marginLeft: "5px"
                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>
                                        ))
                                    }

                                </tbody>

                            </table>

                        </div>
                    )
                }

            </div>

        </div>
    );
}

const mainContainer = {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "Arial"
};

const sidebar = {
    width: "220px",
    background: "#222",
    color: "white",
    padding: "20px"
};

const menuBtn = {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    border: "none",
    cursor: "pointer"
};

const content = {
    flex: 1,
    padding: "30px",
    background: "#f4f4f4"
};

const formBox = {
    width: "350px",
    background: "white",
    padding: "20px",
    borderRadius: "8px"
};

const input = {
    width: "100%",
    height: "40px",
    marginTop: "10px",
    padding: "10px",
    boxSizing: "border-box"
};

const radioBox = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px"
};

const submitBtn = {
    width: "100%",
    height: "40px",
    marginTop: "15px",
    background: "#222",
    color: "white",
    border: "none",
    cursor: "pointer"
};

const searchInput = {
    width: "300px",
    height: "40px",
    padding: "10px",
    marginBottom: "15px"
};

const table = {
    width: "100%",
    background: "white",
    borderCollapse: "collapse"
};

export default App;