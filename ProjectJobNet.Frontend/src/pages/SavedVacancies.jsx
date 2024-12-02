import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Vacancy from "src/components/Vacancy.jsx";

const SavedVacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch vacancies from the backend
        axios.get("https://localhost:6969/api/SavedJob") // Replace with your actual API endpoint
            .then(response => {
                setVacancies(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching vacancies:", error);
                setError("Failed to load vacancies.");
                setLoading(false);
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
        <div style={containerStyle}>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                vacancies.map((vacancy) => (
                    <Vacancy
                        key={vacancy.id}
                        id={vacancy.id}
                        title={vacancy.title}
                        company={vacancy.company}
                        description={vacancy.description}
                    />
                ))
            )}
        </div>
    );
};

export default SavedVacancies;
