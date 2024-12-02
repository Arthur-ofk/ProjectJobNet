import React, { useState } from "react";
import axios from "axios";

const WarningPage = ({ complaintId, onSuccess }) => {
    const [reason, setReason] = useState("");
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const moderatorId = localStorage.getItem("moderatorId");
        const user = localStorage.getItem("user");
        const userId = user.id;

        if (!moderatorId || !userId) {
            setError("Moderator ID or User ID missing from local storage.");
            return;
        }

        const warningData = {
            moderatorId,
            userId,
            complaintId,
            message: `${reason}\n${comment}`,
        };

        try {
            await axios.post("/api/warnings", warningData);
            onSuccess();
        } catch (err) {
            setError("Failed to submit the warning. Please try again.");
            console.error(err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                width: "50%",
                margin: "0 auto",
                padding: "20px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
        >
            <label style={{ fontSize: "16px", fontWeight: "500" }}>
                Причина попередження (видалення)
                <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #cbd5e0",
                        fontSize: "14px",
                    }}
                />
            </label>

            <label style={{ fontSize: "16px", fontWeight: "500" }}>
                Додатковий коментар
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    style={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #cbd5e0",
                        fontSize: "14px",
                    }}
                />
            </label>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <button
                type="submit"
                style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Надіслати
            </button>
        </form>
    );
};

export default WarningPage;
