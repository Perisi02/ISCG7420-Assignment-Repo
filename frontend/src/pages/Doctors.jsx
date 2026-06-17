import {useEffect, useState} from "react";
import api from "../api/api";

function Doctors() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadDoctors() {
            try {
                const response = await api.get("/doctors/");
                setDoctors(response.data);
            } catch {
                setError("Could not load doctors.");
            } finally {
                setLoading(false);
            }
        }

        loadDoctors();
    }, []);

    return (
        <section className="page-card">
            <h1>Doctors</h1>

            {loading && <p className="status-message">Loading doctors...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && doctors.length === 0 && (
                <p className="empty-message">No doctors are currently available.</p>
            )}

            {!loading && doctors.length > 0 && (
                <div className="card-grid">
                    {doctors.map((doctor) => (
                        <article className="info-card" key={doctor.id}>
                            <h2>{doctor.name}</h2>
                            <p>
                                <strong>Specialty:</strong> {doctor.specialty}
                            </p>
                            <p>
                                <strong>Phone:</strong> {doctor.phone || "Not listed"}
                            </p>
                            <p>
                                <strong>Email:</strong> {doctor.email || "Not listed"}
                            </p>
                            <p>{doctor.bio || "No bio available."}</p>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Doctors;