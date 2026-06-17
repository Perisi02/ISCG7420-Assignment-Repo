import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import api from "../api/api";

function BookAppointment() {
    const {slotId} = useParams();
    const navigate = useNavigate();

    const [slot, setSlot] = useState(null);
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSlot() {
            try {
                const response = await api.get("/slots/");
                const selectedSlot = response.data.find(
                    (item) => String(item.id) === String(slotId)
                );

                if (!selectedSlot) {
                    setError("This appointment slot is no longer available.");
                    return;
                }

                setSlot(selectedSlot);
            } catch {
                setError("Could not load appointment slot.");
            } finally {
                setLoading(false);
            }
        }

        loadSlot();
    }, [slotId]);

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");

        try {
            await api.post("/appointments/", {
                slot: Number(slotId),
                reason: reason,
            });

            navigate("/my-appointments");
        } catch {
            setError("Could not book this appointment. It may already be booked.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="page-card">
            <h1>Book Appointment</h1>

            {loading && <p className="status-message">Loading appointment slot...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && slot && (
                <>
                    <div className="summary-box">
                        <p>
                            <strong>Doctor:</strong> {slot.doctor_name}
                        </p>
                        <p>
                            <strong>Specialty:</strong> {slot.doctor_specialty}
                        </p>
                        <p>
                            <strong>Date:</strong> {slot.date}
                        </p>
                        <p>
                            <strong>Time:</strong> {slot.start_time} - {slot.end_time}
                        </p>
                    </div>

                    <form className="form-layout" onSubmit={handleSubmit}>
                        <label>
                            Reason for appointment
                            <textarea
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                required
                            />
                        </label>

                        <button type="submit" disabled={saving}>
                            {saving ? "Booking..." : "Confirm Booking"}
                        </button>
                    </form>
                </>
            )}

            {!loading && !slot && (
                <p>
                    <Link to="/slots">Back to available slots</Link>
                </p>
            )}
        </section>
    );
}

export default BookAppointment;