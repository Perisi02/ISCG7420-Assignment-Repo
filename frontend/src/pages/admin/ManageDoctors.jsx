import {useEffect, useState} from "react";
import api from "../../api/api";

function ManageDoctors() {
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        specialty: "",
        phone: "",
        email: "",
        bio: "",
        is_active: true,
    });

    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadDoctors();
    }, []);

    async function loadDoctors() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/doctors/");
            setDoctors(response.data);
        } catch {
            setError("Could not load doctors.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const {name, value, type, checked} = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    }

    function resetForm() {
        setFormData({
            name: "",
            specialty: "",
            phone: "",
            email: "",
            bio: "",
            is_active: true,
        });

        setEditingDoctorId(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            if (editingDoctorId) {
                await api.patch(`/admin/doctors/${editingDoctorId}/`, formData);
                setMessage("Doctor updated successfully.");
            } else {
                await api.post("/admin/doctors/", formData);
                setMessage("Doctor created successfully.");
            }

            resetForm();
            loadDoctors();
        } catch {
            setError("Could not save doctor. Please check the form details.");
        }
    }

    function startEdit(doctor) {
        setEditingDoctorId(doctor.id);

        setFormData({
            name: doctor.name,
            specialty: doctor.specialty,
            phone: doctor.phone || "",
            email: doctor.email || "",
            bio: doctor.bio || "",
            is_active: doctor.is_active,
        });

        window.scrollTo({top: 0, behavior: "smooth"});
    }

    async function deleteDoctor(doctorId) {
        const confirmed = window.confirm("Delete this doctor?");

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await api.delete(`/admin/doctors/${doctorId}/`);
            setMessage("Doctor deleted successfully.");
            loadDoctors();
        } catch {
            setError("Could not delete doctor. They may have related appointment slots.");
        }
    }

    return (
        <section className="page-card">
            <h1>Manage Doctors</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form className="form-layout" onSubmit={handleSubmit}>
                <label>
                    Name
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Specialty
                    <input
                        type="text"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Phone
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </label>

                <label>
                    Bio
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                    />
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                    />
                    Active doctor
                </label>

                <div className="button-row">
                    <button type="submit">
                        {editingDoctorId ? "Update Doctor" : "Create Doctor"}
                    </button>

                    {editingDoctorId && (
                        <button type="button" className="secondary-button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <hr className="section-divider"/>

            <h2>Existing Doctors</h2>

            {loading && <p className="status-message">Loading doctors...</p>}

            {!loading && doctors.length === 0 && (
                <p className="empty-message">No doctors have been created yet.</p>
            )}

            {!loading && doctors.length > 0 && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {doctors.map((doctor) => (
                            <tr key={doctor.id}>
                                <td>{doctor.name}</td>
                                <td>{doctor.specialty}</td>
                                <td>{doctor.phone || "Not listed"}</td>
                                <td>{doctor.email || "Not listed"}</td>
                                <td>{doctor.is_active ? "Yes" : "No"}</td>
                                <td>
                                    <div className="table-actions">
                                        <button type="button" onClick={() => startEdit(doctor)}>
                                            Edit
                                        </button>

                                        <button type="button" onClick={() => deleteDoctor(doctor.id)}>
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}

export default ManageDoctors;