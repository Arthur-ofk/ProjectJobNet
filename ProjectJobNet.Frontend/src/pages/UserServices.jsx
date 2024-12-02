import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Service from "src/components/Service.jsx";
import AddButton from "src/components/AddButton.jsx";

import { useNavigate } from "react-router-dom";

const UserServices = () => {
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch services from backend API
        axios.get("https://localhost:6969/api/services") // Replace with your actual API endpoint
            .then(response => {
                setServices(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching services:", error);
                setError("Failed to load services.");
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

    const buttonStyle = {
        display:  (localStorage.getItem("userId"))  === services.at(0).userId ? "block" : "none",
    }

    const navigate = useNavigate();
    return (
        <div style={containerStyle}>
            {loading ? (
                <p>Loading services...</p>
            ) : error ? (
                <p>{error}</p>
            ) : (
                services.map((service) => (
                    <Service
                        key={service.id}
                        id={service.id}
                        title={service.title}
                        company={service.company}
                        description={service.description}
                    />
                ))
            )}
            <div style={buttonStyle}>
                <AddButton onClick={() => navigate("/service/create")}/>
            </div>
        </div>
    );
};

export default UserServices;

