import Tag from "./Tag";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ServiceLanding(props) {
    const [user, setUser] = useState([]);
    useEffect(() => {
        axios.get(`https://localhost:6969/api/services/${props.id}`)
        .then(response => {
            axios.get(`https://localhost:6969/api/users/${response.data.userId}`)
            .then(response => {
                setUser(response.data); });
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div
           className="block max-w-md px-12 py-6 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100">
            <div className="flex justify-between">
                <a href={"/services/"+ props.id} >
                    <h5 className="mb-2 text-2xl pt-4 font-bold tracking-tight text-gray-900 hover:underline">{props.serviceName}</h5>
                    <p className="font-semibold text-gray-900 py-1">{props.price} грн/год</p>
                    <p className="font-semibold text-gray-900 py-1 ">{user.firstName} {user.lastName}</p>
                    <p className="font-semibold text-gray-900 py-1 pb-4">{user.address}</p>
                </a>
                <a href={"/user/" + props.userId}><img className="p-5 rounded-t-lg max-h-[20em]"
                                                         src="https://placehold.co/80x100" alt="Vacancy image"/> </a>
            </div>
            <p className="font-normal text-gray-700">{props.description}</p>
            <div className="grid gap-2 sm:grid-cols-3 grid-cols-2 py-4">
                <Tag url="#" text="Назва тегу"/>
                <Tag url="#" text="Назва тегу"/>
                <Tag url="#" text="Назва тегу"/>
            </div>
        </div>
    )
}