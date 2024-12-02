import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Resume from "src/components/Resume.jsx";
import AddButton from "src/components/AddButton.jsx";

const SavedCVs = () => {
    const [resumes, setResumes] = useState([]);
    const [error, setError] = useState(null);

    // Fetch resumes from the backend API
    useEffect(() => {
        axios.get("https://localhost:6969/api/resumes")  // Replace with your actual endpoint
            .then(response => {
                setResumes(response.data);
            })
            .catch(error => {
                console.error("Error fetching resumes:", error);
                setError("Failed to load resumes.");
            });
    }, []);

    const containerStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        padding: "20px",
    };

    return (
        <div>
            <div style={containerStyle}>
                {error ? (
                    <p>{error}</p>
                ) : (
                    resumes.map((resume) => (
                        <Resume
                            key={resume.id}
                            id={resume.id}
                            title={resume.title}
                            username={resume.username}
                            description={resume.description}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default SavedCVs;
