import {useEffect, useState} from "react";
import api from "../../api/api";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDashboard() {
            try {
                const response = await api.get("/admin/dashboard/");
                setDashboard(response.data);
            } catch {
                setError("Could not load dashboard data.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    }, []);

    return (
        <section className="page-card">
            <h1>Admin Dashboard</h1>

            {loading && <p className="status-message">Loading dashboard...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && dashboard && (
                <div className="dashboard-grid">
                    <article className="stat-card">
                        <h2>{dashboard.doctor_count}</h2>
                        <p>Total Doctors</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.active_doctor_count}</h2>
                        <p>Active Doctors</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.slot_count}</h2>
                        <p>Total Slots</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.available_slot_count}</h2>
                        <p>Available Slots</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.appointment_count}</h2>
                        <p>Total Appointments</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.booked_appointment_count}</h2>
                        <p>Booked Appointments</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.cancelled_appointment_count}</h2>
                        <p>Cancelled Appointments</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.patient_count}</h2>
                        <p>Total Patients</p>
                    </article>

                    <article className="stat-card">
                        <h2>{dashboard.active_patient_count}</h2>
                        <p>Active Patients</p>
                    </article>
                </div>
            )}
        </section>
    );
}

export default AdminDashboard;