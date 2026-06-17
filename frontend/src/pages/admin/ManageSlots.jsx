import {useEffect, useState} from "react";
import api from "../../api/api";

function ManageSlots() {
    const [slots, setSlots] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [formData, setFormData] = useState({
        doctor: "",
        date: "",
        start_time: "",
        end_time: "",
        is_available: true,
    });

    const [editingSlotId, setEditingSlotId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadPageData();
    }, []);

    async function loadPageData() {
        setLoading(true);
        setError("");

        try {
            const doctorsResponse = await api.get("/admin/doctors/");
            const slotsResponse = await api.get("/admin/slots/");

            setDoctors(doctorsResponse.data);
            setSlots(slotsResponse.data);
        } catch {
            setError("Could not load admin slot data.");
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
            doctor: "",
            date: "",
            start_time: "",
            end_time: "",
            is_available: true,
        });

        setEditingSlotId(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            if (editingSlotId) {
                await api.patch(`/admin/slots/${editingSlotId}/`, formData);
                setMessage("Slot updated successfully.");
            } else {
                await api.post("/admin/slots/", formData);
                setMessage("Slot created successfully.");
            }

            resetForm();
            loadPageData();
        } catch {
            setError("Could not save slot. Check the doctor, date, and time values.");
        }
    }

    function startEdit(slot) {
        setEditingSlotId(slot.id);

        setFormData({
            doctor: slot.doctor,
            date: slot.date,
            start_time: slot.start_time,
            end_time: slot.end_time,
            is_available: slot.is_available,
        });

        window.scrollTo({top: 0, behavior: "smooth"});
    }

    async function deleteSlot(slotId) {
        const confirmed = window.confirm("Delete this appointment slot?");

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await api.delete(`/admin/slots/${slotId}/`);
            setMessage("Slot deleted successfully.");
            loadPageData();
        } catch {
            setError("Could not delete slot.");
        }
    }

    return (
        <section className="page-card">
            <h1>Manage Slots</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form className="form-layout" onSubmit={handleSubmit}>
                <label>
                    Doctor
                    <select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a doctor</option>

                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} — {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Date
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Start Time
                    <input
                        type="time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    End Time
                    <input
                        type="time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label className="checkbox-label">
                    <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                    />
                    Available for booking
                </label>

                <div className="button-row">
                    <button type="submit">
                        {editingSlotId ? "Update Slot" : "Create Slot"}
                    </button>

                    {editingSlotId && (
                        <button type="button" className="secondary-button" onClick={resetForm}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <hr className="section-divider"/>

            <h2>Existing Slots</h2>

            {loading && <p className="status-message">Loading slots...</p>}

            {!loading && slots.length === 0 && (
                <p className="empty-message">No slots have been created yet.</p>
            )}

            {!loading && slots.length > 0 && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Date</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Available</th>
                            <th>Booked</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {slots.map((slot) => (
                            <tr key={slot.id}>
                                <td>{slot.doctor_name}</td>
                                <td>{slot.doctor_specialty}</td>
                                <td>{slot.date}</td>
                                <td>{slot.start_time}</td>
                                <td>{slot.end_time}</td>
                                <td>{slot.is_available ? "Yes" : "No"}</td>
                                <td>{slot.is_booked ? "Yes" : "No"}</td>
                                <td>
                                    <div className="table-actions">
                                        <button type="button" onClick={() => startEdit(slot)}>
                                            Edit
                                        </button>

                                        <button type="button" onClick={() => deleteSlot(slot.id)}>
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

export default ManageSlots;