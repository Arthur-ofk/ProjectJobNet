import React, { useState, useEffect } from 'react';
import Post from "src/pages/Post.jsx";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Post from "src/pages/Post.jsx";
import {useEffect, useState} from "react";

const ComplaintDetailsPage = () => {
    const [targetPost, setTargetPost] = useState(null);
    const { complaintId } = useParams(); // Extract complaintId from URL

    useEffect(() => {
        // Fetch complaint and target post from backend
        const fetchComplaint = async () => {
            try {
                const response = await axios.get(`/api/complaints/${complaintId}`);
                const { targetPost } = response.data;
                setTargetPost(targetPost);
            } catch (error) {
                console.error("Error fetching complaint data:", error);
            }
        };

        fetchComplaint();
    }, [complaintId]);


    if (!targetPost) {
         // Show loading state while data is being fetched
    }

    return (
        <div>
            <h1>Complaint Details</h1>
            <Post
                header= {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin, turpis quis sagittis vehicula.'}
            username= {'Name Surname'}
            likes={123}
            comments= {123}
            body={ 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis. Nullam malesuada nibh non urna mollis egestas nec scelerisque arcu. Cras volutpat diam nec sem mattis, in varius dolor congue. Vivamus sollicitudin sodales ultrices. Nulla luctus ultricies mi, vitae gravida magna. In erat lacus, facilisis et nulla ut, luctus ornare orci. Aliquam hendrerit lacus ligula, sed hendrerit purus tempor eget. Sed porttitor ipsum sed suscipit consequat. Proin viverra molestie nulla, eu fermentum libero. Quisque fermentum ipsum at diam sollicitudin scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam a tincidunt arcu, at tincidunt orci.\n' +
            'Praesent nec nibh quis enim condimentum fermentum. Nulla facilisi. Vestibulum rhoncus non purus non sodales. Phasellus congue placerat consequat. Pellentesque viverra elit at efficitur condimentum. Suspendisse rutrum viverra arcu at ornare. Duis vulputate quis libero non euismod. Praesent vel sapien urna. Donec interdum orci ante, et vehicula nunc fringilla eget. Proin gravida lacinia augue, eu pretium diam iaculis vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer condimentum viverra dui id mollis. Praesent vestibulum nulla a lorem rhoncus porttitor. Suspendisse a lorem quis lacus condimentum eleifend non at erat.\n' +
            'Sed vel lacus luctus, rutrum ligula non, tincidunt eros. Quisque dolor augue, tincidunt nec odio a, malesuada viverra purus. Praesent rhoncus sed arcu porttitor interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eu porta erat. Nullam nec massa ut leo suscipit bibendum. Fusce ac pharetra eros.\n' +
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec volutpat cursus ex sit amet lobortis. Nulla malesuada ullamcorper leo, ac porttitor dui tempor mattis. Nullam malesuada nibh non urna mollis egestas nec scelerisque arcu. Cras volutpat diam nec sem mattis, in varius dolor congue. Vivamus sollicitudin sodales ultrices. Nulla luctus ultricies mi, vitae gravida magna. In erat lacus, facilisis et nulla ut, luctus ornare orci. Aliquam hendrerit lacus ligula, sed hendrerit purus tempor eget. Sed porttitor ipsum sed suscipit consequat. Proin viverra molestie nulla, eu fermentum libero. Quisque fermentum ipsum at diam sollicitudin scelerisque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nullam a tincidunt arcu, at tincidunt orci.\n' +
            'Praesent nec nibh quis enim condimentum fermentum. Nulla facilisi. Vestibulum rhoncus non purus non sodales. Phasellus congue placerat consequat. Pellentesque viverra elit at efficitur condimentum. Suspendisse rutrum viverra arcu at ornare. Duis vulputate quis libero non euismod. Praesent vel sapien urna. Donec interdum orci ante, et vehicula nunc fringilla eget. Proin gravida lacinia augue, eu pretium diam iaculis vitae. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer condimentum viverra dui id mollis. Praesent vestibulum nulla a lorem rhoncus porttitor. Suspendisse a lorem quis lacus condimentum eleifend non at erat.\n' +
            'Sed vel lacus luctus, rutrum ligula non, tincidunt eros. Quisque dolor augue, tincidunt nec odio a, malesuada viverra purus. Praesent rhoncus sed arcu porttitor interdum. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam eu porta erat. Nullam nec massa ut leo suscipit bibendum. Fusce ac pharetra eros.'}
            tags={ ['tag1']}
            avatar={''} // Default empty avatar if not provided
            bannerImage={''} // Assuming TargetPost has tags field
            />
            {/*<Post*/}
            {/*    header={targetPost.title}*/}
            {/*    username={targetPost.authorName} // Assuming TargetPost has an authorName field*/}
            {/*    avatar={targetPost.authorAvatar} // Assuming TargetPost has an authorAvatar field*/}
            {/*    likes={targetPost.likesCount || 0}*/}
            {/*    comments={targetPost.commentsCount || 0}*/}
            {/*    bannerImage={targetPost.bannerImage} // Assuming TargetPost has a bannerImage field*/}
            {/*    body={targetPost.content} // Assuming TargetPost has a content field*/}
            {/*    tags={targetPost.tags || []} // Assuming TargetPost has tags field*/}
            {/*/>*/}
        </div>
    );
};

export default ComplaintDetailsPage;
