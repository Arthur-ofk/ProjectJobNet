import HeartOutline from "src/icons/HeartOutline.jsx";
import Comments from "src/icons/Comments.jsx";
import Tag from "src/components/Tag.jsx";
import PropTypes from "prop-types";
import Review from "src/components/Review.jsx";

const Post = ({
                  header,
                  username,
                  avatar,
                  likes,
                  comments,
                  bannerImage,
                  body,
                  tags
              }) => {
    const containerStyle = {

        width: '50%',
        margin: '0px 25%',
        backgroundColor: '#FFFFFF',
        borderRadius: '15px',
        padding: '20px 8%',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    const commentStyle = {
        width: '50%',
        margin: '5% 25% 10% 25%',
        padding: '20px 8%',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    };

    const headerStyle = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#000000',
        lineHeight: '1.5',
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3, // Limit to 3 lines
    };

    const userRowStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px',
    };

    const userInfoStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    };

    const avatarStyle = {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: '#D9D9D9', // Placeholder for avatar
    };

    const usernameStyle = {
        fontSize: '18px',
        fontWeight: '500',
        color: '#000000',
    };

    const iconRowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    };

    const iconWithTextStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '16px',
        color: '#6F6F6F',
    };

    const bannerStyle = {
        width: '100%',
        margin: '0 auto',
        borderRadius: '10px',
        objectFit: 'cover',
    };

    const bodyStyle = {
        fontSize: '16px',
        fontWeight: '400',
        color: '#333333',
        lineHeight: '1.6',
    };

    const tagsRowStyle = {
        display: 'flex',
        gap: '15%',
        margin: '8% 25% 8% 25%',
        justifyContent: 'center',
    };

    return (
        <div>
            <div style={containerStyle}>
                {/* Post Header */}
                <div style={headerStyle}>{header}</div>

                {/* User Info and Icons */}
                <div style={userRowStyle}>
                    <div style={userInfoStyle}>
                        <div style={avatarStyle}></div>
                        <span style={usernameStyle}>{username}</span>
                    </div>
                    <div style={iconRowStyle}>
                        <div style={iconWithTextStyle}>
                            <HeartOutline color={"#6F6F6FFF"}/>
                            <span>{likes}</span>
                        </div>
                        <div style={iconWithTextStyle}>
                            <Comments color={"#6F6F6FFF"}/>
                            <span>{comments}</span>
                        </div>
                    </div>
                </div>

                {/* Post Banner */}
                {bannerImage && (
                    <img
                        src={bannerImage}
                        alt="Post Banner"
                        style={bannerStyle}
                    />
                )}

                {/* Post Body */}
                <div style={bodyStyle}>{body}</div>

                {/* Tags Row */}
                <div style={tagsRowStyle}>
                    {tags.map((tag, index) => (
                        <Tag key={index} text={tag}/>
                    ))}
                </div>
            </div>
            <div style={commentStyle}>
                <Review/>
                <Review rating={4.5}/>
            </div>
        </div>
    );
};

Post.propTypes = {
    header: PropTypes.string.isRequired, // Up to 3 lines
    username: PropTypes.string.isRequired,
    avatar: PropTypes.string, // Optional avatar URL
    likes: PropTypes.number.isRequired,
    comments: PropTypes.number.isRequired,
    bannerImage: PropTypes.string, // Optional banner image URL
    body: PropTypes.string.isRequired, // Main post content
    tags: PropTypes.arrayOf(PropTypes.string) // Array of tags
};

Post.defaultProps = {
    header: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin, turpis quis sagittis vehicula.',
    username: 'Name Surname',
    likes: 123,
    comments: 123,
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis. Nullam malesuada nibh non urna mollis egestas nec scelerisque arcu. Cras volutpat diam nec sem mattis, in varius dolor congue. Vivamus sollicitudin sodales ultrices. Nulla luctus ultricies mi, vitae gravida magna. In erat lacus, facilisis et nulla ut, luctus ornare orci. Aliquam hendrerit lacus ligula, sed hendrerit purus tempor eget. Sed porttitor ipsum sed suscipit consequat. Proin viverra molestie nulla, eu fermentum libero. Quisque fermentum ipsum at diam sollicitudin scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam a tincidunt arcu, at tincidunt orci.\n' +
        'Praesent nec nibh quis enim condimentum fermentum. Nulla facilisi. Vestibulum rhoncus non purus non sodales. Phasellus congue placerat consequat. Pellentesque viverra elit at efficitur condimentum. Suspendisse rutrum viverra arcu at ornare. Duis vulputate quis libero non euismod. Praesent vel sapien urna. Donec interdum orci ante, et vehicula nunc fringilla eget. Proin gravida lacinia augue, eu pretium diam iaculis vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer condimentum viverra dui id mollis. Praesent vestibulum nulla a lorem rhoncus porttitor. Suspendisse a lorem quis lacus condimentum eleifend non at erat.\n' +
        'Sed vel lacus luctus, rutrum ligula non, tincidunt eros. Quisque dolor augue, tincidunt nec odio a, malesuada viverra purus. Praesent rhoncus sed arcu porttitor interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eu porta erat. Nullam nec massa ut leo suscipit bibendum. Fusce ac pharetra eros.\n' +
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis. Nullam malesuada nibh non urna mollis egestas nec scelerisque arcu. Cras volutpat diam nec sem mattis, in varius dolor congue. Vivamus sollicitudin sodales ultrices. Nulla luctus ultricies mi, vitae gravida magna. In erat lacus, facilisis et nulla ut, luctus ornare orci. Aliquam hendrerit lacus ligula, sed hendrerit purus tempor eget. Sed porttitor ipsum sed suscipit consequat. Proin viverra molestie nulla, eu fermentum libero. Quisque fermentum ipsum at diam sollicitudin scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam a tincidunt arcu, at tincidunt orci.\n' +
        'Praesent nec nibh quis enim condimentum fermentum. Nulla facilisi. Vestibulum rhoncus non purus non sodales. Phasellus congue placerat consequat. Pellentesque viverra elit at efficitur condimentum. Suspendisse rutrum viverra arcu at ornare. Duis vulputate quis libero non euismod. Praesent vel sapien urna. Donec interdum orci ante, et vehicula nunc fringilla eget. Proin gravida lacinia augue, eu pretium diam iaculis vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer condimentum viverra dui id mollis. Praesent vestibulum nulla a lorem rhoncus porttitor. Suspendisse a lorem quis lacus condimentum eleifend non at erat.\n' +
        'Sed vel lacus luctus, rutrum ligula non, tincidunt eros. Quisque dolor augue, tincidunt nec odio a, malesuada viverra purus. Praesent rhoncus sed arcu porttitor interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eu porta erat. Nullam nec massa ut leo suscipit bibendum. Fusce ac pharetra eros.',
    tags: ['tag1'],
    avatar: '', // Default empty avatar if not provided
    bannerImage: '', // Default empty banner image if not provided
};

export default Post;
