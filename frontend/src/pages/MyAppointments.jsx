import {useEffect, useState} from "react";
import api from "../api/api";

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editReason, setEditReason] = useState("");

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
            const response = await api.get("/appointments/my/");
            setAppointments(response.data);
        } catch {
            setError("Could not load your appointments.");
        } finally {
            setLoading(false);
        }
    }

    function startEdit(appointment) {
        setEditingId(appointment.id);
        setEditReason(appointment.reason);
        setMessage("");
        setError("");
    }

    function cancelEdit() {
        setEditingId(null);
        setEditReason("");
    }

    async function saveEdit(appointmentId) {
        setMessage("");
        setError("");

        try {
            await api.patch(`/appointments/${appointmentId}/`, {
                reason: editReason,
            });

            setMessage("Appointment reason updated successfully.");
            cancelEdit();
            loadAppointments();
        } catch {
            setError("Could not update appointment reason.");
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
            await api.patch(`/appointments/${appointmentId}/cancel/`);
            setMessage("Appointment cancelled successfully.");
            loadAppointments();
        } catch {
            setError("Could not cancel appointment.");
        }
    }

    return (
        <section className="page-card">
            <h1>My Appointments</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="status-message">Loading appointments...</p>}

            {!loading && appointments.length === 0 && (
                <p className="empty-message">You do not have any appointments yet.</p>
            )}

            {!loading && appointments.length > 0 && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Doctor</th>
                            <th>Specialty</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>{appointment.doctor_name}</td>
                                <td>{appointment.doctor_specialty}</td>
                                <td>{appointment.slot_date}</td>
                                <td>
                                    {appointment.slot_start_time} - {appointment.slot_end_time}
                                </td>
                                <td>
                                    {editingId === appointment.id ? (
                                        <textarea
                                            className="table-textarea"
                                            value={editReason}
                                            onChange={(event) => setEditReason(event.target.value)}
                                        />
                                    ) : (
                                        appointment.reason
                                    )}
                                </td>
                                <td>{appointment.status}</td>
                                <td>
                                    {editingId === appointment.id ? (
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                onClick={() => saveEdit(appointment.id)}
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
                                                disabled={appointment.status === "Cancelled"}
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

export default MyAppointments;