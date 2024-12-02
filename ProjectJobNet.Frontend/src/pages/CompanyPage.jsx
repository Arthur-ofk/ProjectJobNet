import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

import PropTypes from "prop-types";
import Verified from "src/icons/Verified.jsx";
import Info from "src/icons/Info.jsx";
import VacancyIcon from "src/icons/VacancyIcon.jsx";
import BlogIcon from "src/icons/BlogIcon.jsx";


const CompanyPage = ({
                         name,
                         description,
                         website,
                         bannerColor = "#f4f4f4",
                         verified = false
                     }) => {
    const bannerStyle = {
        backgroundColor: bannerColor,
        width: "100%",
        height: "30vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: '50px',
    };

    const containerStyle = {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        padding: "20px",
        marginTop: "-50px", // Slight overlap with the banner
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "70%",
        margin: "auto",
    };

    const headerStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#000000",
    };

    const descriptionStyle = {
        fontSize: "16px",
        lineHeight: "1.5",
        color: "#6F6F6F",
        marginTop: "10px",
    };

    const websiteStyle = {
        fontSize: "16px",
        color: "#007BFF",
        textDecoration: "underline",
        marginTop: "10px",
    };

    const buttonsContainerStyle = {
        width: '70%',
        display: "flex",
        justifyContent: "center",
        gap: "15px",
        marginTop: "20px",
        marginLeft: "auto",
        marginRight: "auto",

    };

    const buttonStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '18px',
        fontWeight: '500',
        margin: '30px 50px',
        height: '100px',
        width: '25%',

    };

    const navigate = useNavigate();
    const { id } = useParams();
    const [userInfo, setUserInfo] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:6969/api/users/${id}`)
        .then(response => {
            setUserInfo(response.data);
         })
         .catch(error => {
             console.error(error);
         });
    }) 

    return (
        <>
            {/* Banner */}
            <div style={bannerStyle}></div>

            {/* Main Content */}
            <div style={containerStyle}>
                {/* Company Info */}

                <div style={headerStyle}>
                    {userInfo.firstName}
                    <Verified width={15} height={15} color={'#000000'}/>
                </div>
                <div style={descriptionStyle}>{description}</div>
                <a href={website} target="_blank" rel="noopener noreferrer" style={websiteStyle}>
                    {website}
                </a>


            </div>
            {/* Buttons */}
            <div style={buttonsContainerStyle}>
                <button style={buttonStyle} onClick={() => window.open(website, "_blank", "noreferrer")}>
                    <span style={{marginRight: '20px'}}><Info width={'40px'} height={'40px'}/></span>
                    Про компанію
                </button>
                <button style={buttonStyle} onClick={() => navigate(`/company/${id}/vacancies`)}>
                    <span style={{marginRight: '20px'}}><VacancyIcon width={'50px'} height={'50px'}/></span>
                    Вакансії
                </button>
                <button style={buttonStyle} onClick={() => navigate(`/company/${id}/blog`)} >
                    <span style={{marginRight: '20px'}}><BlogIcon width={'40px'} height={'40px'}/></span>
                    Блог
                </button>
            </div>
        </>
    );
};

CompanyPage.propTypes = {
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    website: PropTypes.string,
    bannerColor: PropTypes.string,
    verified: PropTypes.bool,
};

CompanyPage.defaultProps = {
    name: "Company Name",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis.",
    website: "https://www.company-website.com",
    bannerColor: "#f4f4f4",
    verified: true,
};

export default CompanyPage;
