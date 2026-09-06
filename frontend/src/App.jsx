import { useEffect, useState } from "react";
import "./App.css";

const API = "http://127.0.0.1:8000/api/students/";

function App() {
  const emptyForm = {
    name: "",
    email: "",
    course: "",
    phone: "",
  };

  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  // GET STUDENTS
  const loadStudents = async () => {
    const response = await fetch(API);
    const data = await response.json();
    setStudents(data);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId ? `${API}${editId}/` : API;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm(emptyForm);
    setEditId(null);
    loadStudents();
  };

  // EDIT
  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      phone: student.phone || "",
    });

    setEditId(student.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE
  const deleteStudent = async (id) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    await fetch(`${API}${id}/`, {
      method: "DELETE",
    });

    loadStudents();
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  // SEARCH
  const filteredStudents = students.filter((student) =>
    `${student.name} ${student.email} ${student.course}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const courseCount = new Set(
    students.map((student) => student.course)
  ).size;

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside>
        <div className="logo">
          AMAN<span>CRM.</span>
        </div>

        <div className="menu">
          <div className="active">▦ Dashboard</div>
          <div>♙ Students</div>
          <div>◫ Courses</div>
          <div>⚙ Settings</div>
        </div>

        <p className="sidebar-footer">
          Student Management
          <br />
          System v1.0
        </p>
      </aside>

      {/* MAIN */}
      <main>

        {/* TOPBAR */}
        <header className="topbar">
          <div>
            <p>STUDENT MANAGEMENT</p>
            <h1>Dashboard</h1>
          </div>

          <div className="admin">
            <span>AK</span>

            <div>
              <strong>Administrator</strong>
              <small>Project Dashboard</small>
            </div>
          </div>
        </header>

        {/* STATS */}
        <section className="stats">

          <article>
            <span>01</span>
            <p>Total Students</p>
            <strong>{students.length}</strong>
          </article>

          <article>
            <span>02</span>
            <p>Total Courses</p>
            <strong>{courseCount}</strong>
          </article>

          <article>
            <span>03</span>
            <p>System Status</p>
            <strong className="online">Active</strong>
          </article>

        </section>

        {/* ADD / UPDATE FORM */}
        <section className="panel">

          <div className="panel-title">
            <div>
              <p>STUDENT FORM</p>

              <h2>
                {editId ? "Update Student" : "Add New Student"}
              </h2>
            </div>

            <span className="api-status">
              ● API Connected
            </span>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <label>
                Student Name

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />
              </label>

              <label>
                Email Address

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@email.com"
                  required
                />
              </label>

              <label>
                Course

                <input
                  type="text"
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  placeholder="B.Tech CSE"
                  required
                />
              </label>

              <label>
                Phone

                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </label>

            </div>

            <div className="form-buttons">

              <button className="primary" type="submit">
                {editId ? "Update Student" : "+ Add Student"}
              </button>

              {editId && (
                <button
                  type="button"
                  className="cancel"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* STUDENT LIST */}
        <section className="panel">

          <div className="list-header">

            <div>
              <p>DATABASE RECORDS</p>
              <h2>Students</h2>
            </div>

            <input
              className="search"
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

          <div className="table-wrap">

            {filteredStudents.length > 0 ? (

              <table>

                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredStudents.map((student) => (

                    <tr key={student.id}>

                      <td>
                        <div className="student">

                          <span>
                            {student.name.charAt(0).toUpperCase()}
                          </span>

                          <div>
                            <strong>{student.name}</strong>
                            <small>{student.email}</small>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span className="course">
                          {student.course}
                        </span>
                      </td>

                      <td>
                        {student.phone || "—"}
                      </td>

                      <td>
                        <div className="actions">

                          <button
                            className="edit"
                            onClick={() => editStudent(student)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete"
                            onClick={() => deleteStudent(student.id)}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            ) : (

              <div className="empty">
                <div>⌕</div>
                <h3>No students found</h3>
                <p>Add your first student using the form above.</p>
              </div>

            )}

          </div>

        </section>

        <footer>
          © 2026 Student Manager • Django REST API + React
        </footer>

      </main>

    </div>
  );
}

export default App;