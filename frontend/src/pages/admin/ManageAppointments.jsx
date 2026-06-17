import {useEffect, useState} from "react";
import api from "../../api/api";

function ManageAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        reason: "",
        status: "Booked",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadAppointments();
    }, []);

    async function loadAppointments() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/appointments/");
            setAppointments(response.data);
        } catch {
            setError("Could not load appointments.");
        } finally {
            setLoading(false);
        }
    }

    function startEdit(appointment) {
        setEditingId(appointment.id);

        setFormData({
            reason: appointment.reason || "",
            status: appointment.status || "Booked",
        });

        setMessage("");
        setError("");
    }

    function cancelEdit() {
        setEditingId(null);

        setFormData({
            reason: "",
            status: "Booked",
        });
    }

    function handleChange(event) {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    async function saveAppointment(appointmentId) {
        setMessage("");
        setError("");

        try {
            await api.patch(`/admin/appointments/${appointmentId}/`, formData);

            setMessage("Appointment updated successfully.");
            cancelEdit();
            loadAppointments();
        } catch {
            setError("Could not update appointment.");
        }
    }

    async function cancelAppointment(appointmentId) {
        const confirmed = window.confirm("Cancel this appointment?");

        if (!confirmed) {
            return;
        }

        setMessage("");
        setError("");

        try {
            await api.patch(`/admin/appointments/${appointmentId}/`, {
                status: "Cancelled",
            });

            setMessage("Appointment cancelled successfully.");
            loadAppointments();
        } catch {
            setError("Could not cancel appointment.");
        }
    }

    return (
        <section className="page-card">
            <h1>Manage Appointments</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="status-message">Loading appointments...</p>}

            {!loading && appointments.length === 0 && (
                <p className="empty-message">No appointments have been booked yet.</p>
            )}

            {!loading && appointments.length > 0 && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Booked At</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.patient_username}</td>
                                <td>{appointment.doctor_name}</td>
                                <td>{appointment.slot_date}</td>
                                <td>
                                    {appointment.slot_start_time} -{" "}
                                    {appointment.slot_end_time}
                                </td>

                                <td>
                                    {editingId === appointment.id ? (
                                        <textarea
                                            className="table-textarea"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                        />
                                    ) : (
                                        appointment.reason
                                    )}
                                </td>

                                <td>
                                    {editingId === appointment.id ? (
                                        <select
                                            className="table-select"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >
                                            <option value="Booked">Booked</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    ) : (
                                        <span
                                            className={
                                                appointment.status === "Cancelled"
                                                    ? "status-badge cancelled"
                                                    : "status-badge booked"
                                            }
                                        >
                        {appointment.status}
                      </span>
                                    )}
                                </td>

                                <td>{appointment.booked_at}</td>

                                <td>
                                    {editingId === appointment.id ? (
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => saveAppointment(appointment.id)}
                                            >
                                                Save
                                            </button>

                                            <button type="button" onClick={cancelEdit}>
                                                Cancel Edit
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(appointment)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                disabled={appointment.status === "Cancelled"}
                                                onClick={() => cancelAppointment(appointment.id)}
                                            >
                                                Cancel Appointment
                                            </button>
                                        </div>
                                    )}
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

export default ManageAppointments;