import PropTypes from "prop-types";

const Complaint = ({ complaint, onClick }) => {

    const { complainant, description, status, submittedAt, targetPost } = complaint;

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        margin: '8px 0',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
    };

    const statusStyle = {
        padding: '4px 8px',
        borderRadius: '4px',
        fontWeight: 'bold',
        color: status === 'Resolved' ? 'green' : 'red',
        backgroundColor: status === 'Resolved' ? '#e0f7e9' : '#fdecea',
    };

    return (
        <div style={cardStyle} onClick={onClick}>
            <div>
                <strong>{complainant?.name || "Anonymous"}</strong>
                <span style={statusStyle}>{status}</span>
            </div>
            <p>{description.substring(0, 50)}...</p>
            <small>{new Date(submittedAt).toLocaleString()}</small>
        </div>
    );
};

Complaint.propTypes = {
    complaint: PropTypes.shape({
        complainant: PropTypes.shape({
            name: PropTypes.string,
        }),
        targetPost: PropTypes.shape({
            title: PropTypes.string,
            content: PropTypes.string,
        }),
        description: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        submittedAt: PropTypes.string.isRequired,
    }),
    onClick: PropTypes.func.isRequired,
};

Complaint.defaultProps={
    id: "1",
    complainant: { name: "John Doe" },
    description: "Inappropriate content in the post",
    status: "Pending",
    submittedAt: "2024-11-25T12:30:00Z",
    targetPost: {
        title: "Beach Trip 2024",
        content: "Looking for companions for a beach trip next weekend!",
    }
}

export default Complaint;
