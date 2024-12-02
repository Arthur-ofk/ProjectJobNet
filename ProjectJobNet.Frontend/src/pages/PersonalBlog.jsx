import { useNavigate } from "react-router-dom";

import BlogPost from "src/components/BlogPost.jsx";
import Pagination from "src/components/pageComponents/Pagination.jsx";
import Tag from "src/components/Tag.jsx";
import AddButton from "src/components/AddButton.jsx";

export default function PersonalBlog() {
    const navigate = useNavigate();

    const containerStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, auto)', // Three columns
        gridTemplateRows: 'auto auto auto', // Three rows
        gap: '10px', // Spacing between divs
        justifyContent: 'center', // Center content horizontally
    };

    const boxStyle = {

        padding: '20px',
        textAlign: 'center',
        justifyContent: 'center'
    };

    const tagStyle={
        width: '300px',
        marginBottom: '40px',
        marginTop: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const searchBar =
        {
            backgroundColor: '#ffffff',
            height:'70px',
            width:'300px',
            borderRadius:'30px',
            textAlign:'center',
            fontSize:'23px',
            verticalAlign: "middle",
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '40px',
        }

    const div1Style = {gridColumn: 1, gridRow: 1};
    const div2Style = {gridColumn: 2, gridRow: 1};
    const div3Style = {gridColumn: 3, gridRow: 1};
    const div4Style = {gridColumn: 1, gridRow: 2};
    const div5Style = {gridColumn: 2, gridRow: 2};
    const div6Style = {
        gridColumn: 'span 2', // Spans across two columns
        gridRow: 3,
        justifySelf: 'center', // Centers within its span
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <div style={{...boxStyle, ...div1Style}}>
                <AddButton width={'100%'} height={'100%'} onClick={() => navigate("/post/create")}/>
            </div>
            <div style={{...boxStyle, ...div2Style}}><BlogPost/></div>
            <div style={{...boxStyle, ...div3Style}}>
                <div style={searchBar}>Пошук постів</div>
                <div style={tagStyle}><Tag text="category"/></div>
                <div style={tagStyle}><Tag text="category"/></div>
                <div style={tagStyle}><Tag text="category"/></div>
            </div>
            <div style={{...boxStyle, ...div4Style}}><BlogPost/></div>
            <div style={{...boxStyle, ...div5Style}}><BlogPost/></div>
            <div style={{...boxStyle, ...div6Style}}><Pagination/></div>
        </div>
    );
}
