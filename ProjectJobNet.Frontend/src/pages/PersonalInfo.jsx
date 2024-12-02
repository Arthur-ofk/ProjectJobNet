import PropTypes from "prop-types";
import Inst from "src/icons/Inst.jsx";
import Telegram from "src/icons/Telegram.jsx";
import Viber from "src/icons/Viber.jsx";
import Edit from "src/icons/Edit.jsx";

import { useState, useEffect } from "react";
import axios from 'axios';

const PersonalInfo = ({
                          name,
                          specialization,
                          city,
                          region,
                          phone,
                          instagram,
                          telegram,
                          viber,
                          description,
                      }) => {
    const containerStyle = {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        padding: "3% 5.5%",
        width: "60%",
        margin: "2% 20% 2% 20%",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "20px",
        alignItems: "center",
    };

    const leftColumnStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };

    const headerStyle = {
        fontSize: "20px",
        fontWeight: "bold",
        display: "flex",
        alignItems: "center",
        gap: "10px",
    };

    const contactInfoStyle = {
        fontSize: "16px",
    };

    const rightColumnStyle = {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
    };

    const photoStyle = {
        width: "150px",
        height: "150px",
        backgroundColor: "#e0e0e0",
        borderRadius: "10px",
    };

    const descriptionStyle = {
        marginTop: "20px",
        fontSize: "16px",
        lineHeight: "1.5",
    };

    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:6969/api/users/${localStorage.getItem("userId")}`)
        .then(response => {
            setUserInfo(response.data);
         })
         .catch(error => {
             console.error(error);
         });
    }) 

    return (
        <div style={containerStyle}>
            {/* Grid Section */}
            <div style={gridStyle}>
                {/* Left Column */}
                <div style={leftColumnStyle}>
                    <div style={headerStyle}>
                        {userInfo.firstName} {userInfo.lastName}
                        <span style={{ cursor: "pointer" }}>
                            <Edit width={20} height={20} color={"#000000"} />
                        </span>
                    </div>
                    <div style={contactInfoStyle}>
                        {userInfo.address} область
                    </div>
                    <div style={contactInfoStyle}>{userInfo.phoneNumber}</div>
                    <div
                        style={{
                            ...contactInfoStyle,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Inst width={20} height={20} color="#6f6f6f" />
                        {instagram}
                    </div>
                    <div
                        style={{
                            ...contactInfoStyle,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Telegram width={20} height={20} color="#6f6f6f" />
                        {telegram}
                    </div>
                    <div
                        style={{
                            ...contactInfoStyle,
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                        }}
                    >
                        <Viber width={20} height={20} color="#6f6f6f" />
                        {viber}
                    </div>
                </div>

                {/* Right Column */}
                <div style={rightColumnStyle}>
                    <div style={photoStyle}></div>
                </div>
            </div>

            {/* Description Section */}
            <div style={descriptionStyle}>{description}</div>
        </div>
    );
};

PersonalInfo.propTypes = {
    name: PropTypes.string,
    specialization: PropTypes.string,
    city: PropTypes.string,
    region: PropTypes.string,
    phone: PropTypes.string,
    instagram: PropTypes.string,
    telegram: PropTypes.string,
    viber: PropTypes.string,
    description: PropTypes.string,
};

PersonalInfo.defaultProps = {
    name: "Ім'я Прізвище",
    specialization: "Спеціалізація",
    city: "Місто",
    region: "Область",
    phone: "+000-000-00-00",
    instagram: "ім'я_користувача",
    telegram: "ім'я_користувача",
    viber: "ім'я_користувача",
    description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin, turpis quis sagittis vehicula, sem erat semper mauris, nec rutrum turpis dui ac ante. Etiam imperdiet libero sed felis tempus scelerisque eget et urna. Vivamus fermentum tortor lorem.",
};

export default PersonalInfo;
