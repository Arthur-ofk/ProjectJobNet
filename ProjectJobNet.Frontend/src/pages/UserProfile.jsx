import CVIcon from "src/icons/CVIcon.jsx";
import ServiceIcon from "src/icons/ServiceIcon.jsx";
import HeartOutline from "src/icons/HeartOutline.jsx";
import UserInfoIcon from "src/icons/UserInfoIcon.jsx";
import BlogIcon from "src/icons/BlogIcon.jsx";
import Quit from "src/icons/Quit.jsx";

import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6%',
        margin: '0 6%',
    };

    const cellStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '18px',
        fontWeight: '500',
        gap: '15px',
        height: '120px'
    };

    const items = [
        { text: 'Мої резюме', icon: <CVIcon/> , href:"/user/my-resumes"},
        { text: 'Мої послуги', icon: <ServiceIcon/>, href: "/user/my-services"},
        { text: 'Збережені вакансії', icon: <HeartOutline width={50} height={50}/>, href: "/user/saved-vacancies" },
        { text: 'Особисті дані', icon: <UserInfoIcon/>, href: "/user/personal-info" },
        { text: 'Блог', icon: <BlogIcon/>, href:"/user/my-blog" },
        { text: 'Вийти', icon: <Quit/>, href: "/"},
    ];

    const navigate = useNavigate();

    return (
        <div style={containerStyle}>
            {items.map((item, index) => (
                <button key={index} style={cellStyle} onClick={() => {item.text === "Вийти" && localStorage.clear(); navigate(item.href)}}>
                    {item.icon}
                    {item.text}
                </button>
            ))}
        </div>
    );
};


export default UserProfile;
