import PropTypes from "prop-types";
import Inst from "src/icons/Inst.jsx";
import Telegram from "src/icons/Telegram.jsx";
import Viber from "src/icons/Viber.jsx";
import CVIcon from "src/icons/CVIcon.jsx";
import ServiceIcon from "src/icons/ServiceIcon.jsx";
import BlogIcon from "src/icons/BlogIcon.jsx";
import Review from "src/components/Review.jsx";

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfilePage = ({
                             name,
                             specialization,
                             city,
                             region,
                             phone,
                             description,
                             onResumeClick,
                             onServicesClick,
                             onBlogClick,
                             reviews = [{
                                 avatar: "",
                                 name: "Олександр Коваленко",
                                 comment: "Чудовий спеціаліст! Дуже приємно працювати, все було зроблено швидко та якісно. Рекомендую всім!",
                                 rating: 4.5,
                             },{},{}]
                         }) => {
    const containerStyle = {
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        padding: "3% 5.5%",
        width: "70%",
        margin: "2% auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    };

    const gridStyle = {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        columnGap: "20px",
    };

    const leftColumnStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    };

    const headerStyle = {
        fontSize: "24px",
        fontWeight: "bold",
    };

    const contactRowStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "10px",
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

    const buttonContainerStyle = {
        display: "flex",
        justifyContent: "space-around",
        marginTop: "20px",
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
        width: '25%'
    };
    const reviewsContainerStyle = {
        marginTop: "30px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: 'center'
    };

    const navigate = useNavigate();
    const { id } = useParams();

    const [user, setUser] = useState([]);
    useEffect(() => {
       axios.get(`https://localhost:6969/api/users/${id}`)
       .then(response => {
            setUser(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div>
            <div style={containerStyle}>
                {/* Grid Section */}
                <div style={gridStyle}>
                    {/* Left Column */}
                    <div style={leftColumnStyle}>
                        <div style={headerStyle}>
                            {user.firstName} {user.lastName}, {specialization}
                        </div>
                        <div>
                            {user.address} область
                        </div>
                        <div>{user.phoneNumber}</div>
                        <div style={contactRowStyle}>
                            <Inst width={20} height={20} color="#6f6f6f"/>
                            <Telegram width={20} height={20} color="#6f6f6f"/>
                            <Viber width={20} height={20} color="#6f6f6f"/>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={rightColumnStyle}>
                        <div style={photoStyle}></div>
                    </div>
                </div>

                {/* Description Section */}
                <div style={descriptionStyle}>{description}</div>

                {/* Buttons Section */}
                <div style={buttonContainerStyle}>
                    <button style={buttonStyle} onClick={() => navigate(`/user/${id}/resumes`)}>
                        <span style={{marginRight: '20px'}}><CVIcon/></span>
                        Резюме
                    </button>
                    <button style={buttonStyle} onClick={() => navigate(`/user/${id}/services`)}>
                        <span style={{marginRight: '20px'}}><ServiceIcon style={{marginRight: '20px'}}/></span>
                        Послуги
                    </button>
                    <button style={buttonStyle} onClick={() => navigate(`/user/${id}/blog`)}>
                        <span style={{marginRight: '20px'}}><BlogIcon style={{marginRight: '20px'}}/></span>
                        Блог
                    </button>
                </div>
            </div>
            <div style={reviewsContainerStyle}>
                {reviews.map((review, index) => (
                    <Review
                        key={index}
                        avatar={review.avatar}
                        name={review.name}
                        comment={review.comment}
                        rating={review.rating}
                    />
                ))}
            </div>
        </div>
    )
        ;
};

UserProfilePage.propTypes = {
    name: PropTypes.string,
    specialization: PropTypes.string,
    city: PropTypes.string,
    region: PropTypes.string,
    phone: PropTypes.string,
    description: PropTypes.string,
    onResumeClick: PropTypes.func,
    onServicesClick: PropTypes.func,
    onBlogClick: PropTypes.func,
    reviews: PropTypes.arrayOf(PropTypes.object),
};

UserProfilePage.defaultProps = {
    name: "Ім'я Прізвище",
    specialization: "Спеціалізація",
    city: "Місто",
    region: "Область",
    phone: "+000-000-00-00",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis. Nullam malesuada nibh non urna mollis egestas nec scelerisque arcu. Cras volutpat diam nec sem mattis, in varius dolor congue. Vivamus sollicitudin sodales ultrices. Nulla luctus ultricies mi, vitae gravida magna .In erat lacus, facilisis et nulla ut, luctus ornare orci. Aliquam hendrerit lacus ligula, sed hendrerit purus tempor eget. ",

    review: [

    ],
};

export default UserProfilePage;
