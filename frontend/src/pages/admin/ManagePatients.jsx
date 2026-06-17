import {useEffect, useState} from "react";
import api from "../../api/api";

function ManagePatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadPatients();
    }, []);

    async function loadPatients() {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/admin/patients/");
            setPatients(response.data);
        } catch {
            setError("Could not load patients.");
        } finally {
            setLoading(false);
        }
    }

    async function updatePatientStatus(patientId, isActive) {
        setMessage("");
        setError("");

        try {
            await api.patch(`/admin/patients/${patientId}/`, {
                is_active: isActive,
            });

            setMessage(
                isActive
                    ? "Patient account reactivated successfully."
                    : "Patient account deactivated successfully."
            );

            loadPatients();
        } catch {
            setError("Could not update patient account.");
        }
    }

    return (
        <section className="page-card">
            <h1>Manage Patients</h1>

            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            {loading && <p className="status-message">Loading patients...</p>}

            {!loading && patients.length === 0 && (
                <p className="empty-message">No patient accounts found.</p>
            )}

            {!loading && patients.length > 0 && (
                <div className="table-wrapper">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Active</th>
                            <th>Date Joined</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>{patient.username}</td>
                                <td>{patient.email || "Not listed"}</td>
                                <td>
                    <span
                        className={
                            patient.is_active
                                ? "status-badge booked"
                                : "status-badge cancelled"
                        }
                    >
                      {patient.is_active ? "Active" : "Inactive"}
                    </span>
                                </td>
                                <td>{patient.date_joined}</td>
                                <td>
                                    <div className="table-actions">
                                        {patient.is_active ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updatePatientStatus(patient.id, false)
                                                }
                                            >
                                                Deactivate
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    updatePatientStatus(patient.id, true)
                                                }
                                            >
                                                Reactivate
                                            </button>
                                        )}
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

export default ManagePatients;