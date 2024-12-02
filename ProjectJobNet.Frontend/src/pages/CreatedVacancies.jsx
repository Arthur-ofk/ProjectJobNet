import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Vacancy from "src/components/Vacancy.jsx";
import AddButton from "src/components/AddButton.jsx";
import { useNavigate } from 'react-router-dom';

const SavedVacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch vacancies from the backend
        axios.get("https://localhost:6969/api/jobs") // Replace with your actual API endpoint
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

    const navigate = useNavigate()
    return (
        <div>
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
            <AddButton onClick={() => navigate("/vacancy/create")}/>
        </div>
    );
};

export default SavedVacancies;

