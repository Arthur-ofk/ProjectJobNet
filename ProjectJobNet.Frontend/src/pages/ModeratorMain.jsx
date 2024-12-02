import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Complaint from "src/components/Complaint.jsx";
import axios from "axios";
import Post from "src/pages/Post.jsx";
import "src/pages/styles/ModeratorMain.css";

const ModeratorMain = () => {
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios
            .get("https://localhost:6969/api/complaints")
            .then((response) => setComplaints(response.data))
            .catch((error) => console.error("Error fetching complaints:", error));
    }, []);

    const handleViewComplaint = (id) => {
        const genericComplaint = {
            id,
            complainant: { name: "Test User" },
            description: "This is a test complaint for debugging purposes.",
            status: "Pending",
            submittedAt: new Date().toISOString(),
            targetPost: {
                title: "Sample Post",
                content: "This is a placeholder post content.",
            },
        };

        const complaint = complaints.find((c) => c.id === id) || genericComplaint;
        setSelectedComplaint(complaint);
    };

    const handleRejectComplaint = (id) => {
        console.log("Reject complaint ID:", id);
    };

    const handleNavigateToDetails = (id) => {
        navigate(`/moderator/complaint/${id}`);
    };

    const handleNavigateToWarning = (id) => {
        navigate(`/moderator/complaint/warning/${id}`);
    };

    return (
        <div className="chat-container">
            <div className="message-list">
                {complaints.map((complaint) => (
                    <Complaint
                        key={complaint.id}
                        complaint={{
                            complainant: { name: complaint.complainant.name },
                            description: complaint.description.substring(0, 50) + "...",
                            status: "Pending",
                            submittedAt: "2024-12-01T10:00:00Z",
                            targetPost: {
                                title: complaint.targetPost.title,
                                content: complaint.targetPost.content
                            },
                        }}
                        onClick={() => handleViewComplaint(complaint.id)}
                    />
                ))}
                {/* Example Complaint */}
                {/*<Complaint*/}
                {/*    key={1}*/}
                {/*    complaint={{*/}
                {/*        complainant: { name: "name" },*/}
                {/*        description: "teeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeext",*/}
                {/*        status: "Pending",*/}
                {/*        submittedAt: "2024-12-01T10:00:00Z",*/}
                {/*        targetPost: {*/}
                {/*            header: "Sample Post Header",*/}
                {/*            username: "Name Surname",*/}
                {/*            likes: 123,*/}
                {/*            comments: 123,*/}
                {/*            body: "Sample post content for debugging purposes.",*/}
                {/*            tags: ["tag1"],*/}
                {/*            avatar: "",*/}
                {/*            bannerImage: "",*/}
                {/*        },*/}
                {/*    }}*/}
                {/*    onClick={() => handleViewComplaint(1)}*/}
                {/*/>*/}
            </div>

            <div className="message-content">
                {selectedComplaint ? (
                    <>
                        <div className="message-details">
                            <h2>Details of Complaint</h2>
                            <Post post={selectedComplaint.targetPost} />
                            <p>
                                <strong>Description:</strong> {selectedComplaint.description}
                            </p>
                            <p>
                                <strong>Status:</strong> {selectedComplaint.status}
                            </p>
                            <p>
                                <strong>Submitted At:</strong>{" "}
                                {new Date(selectedComplaint.submittedAt).toLocaleString()}
                            </p>
                        </div>
                        <div className="message-actions">
                            <button
                                onClick={() => handleRejectComplaint(selectedComplaint?.id)}
                                className="action-button reject-button"
                            >
                                Відхилити
                            </button>
                            <button
                                onClick={() => handleNavigateToDetails(selectedComplaint?.id)}
                                className="action-button view-button"
                            >
                                Детальніше
                            </button>
                            <button
                                onClick={() => handleNavigateToWarning(selectedComplaint?.id)}
                                className="action-button view-button"
                            >
                                Розглянути
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Please select a complaint to view details.</p>
                )}
            </div>
        </div>
    );
};

export default ModeratorMain;
