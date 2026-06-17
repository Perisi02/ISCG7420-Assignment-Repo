import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import api from "../api/api";

function Slots() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSlots() {
            try {
                const response = await api.get("/slots/");
                setSlots(response.data);
            } catch {
                setError("Could not load appointment slots.");
            } finally {
                setLoading(false);
            }
        }

        loadSlots();
    }, []);

    return (
        <section className="page-card">
            <h1>Available Appointment Slots</h1>

            {loading && <p className="status-message">Loading slots...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && slots.length === 0 && (
                <p className="empty-message">No appointment slots are currently available.</p>
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
                            <th>Book</th>
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
                                <td>
                                    <Link className="small-button" to={`/slots/${slot.id}/book`}>
                                        Book
                                    </Link>
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

export default Slots;