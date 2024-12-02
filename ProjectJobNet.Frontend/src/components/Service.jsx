import HeartOutline from "../icons/HeartOutline";
import ReportForm from "./modals/ReportForm";
import Tag from "./Tag";
import Edit from "../icons/Edit";
import Telegram from "../icons/Telegram";
import Viber from "../icons/Viber";
import Inst from "../icons/Inst";
import DeleteModal from "./modals/DeleteModal";

import { useLocation } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Service(props){

  const location = useLocation();

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

    return(
        <div className="block max-w-4xl h-fit px-12 py-6 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100">
          <div className="relative flex justify-between">
            <a href={"/services/"+ props.id} className="block">
                <h5 className="mb-2 text-2xl pt-4 font-bold tracking-tight text-gray-900 hover:underline">{props.serviceName}</h5>
                <p className="font-semibold text-gray-900 py-1">{props.price} грн/год</p>
                <p className="font-semibold text-gray-900 py-1 ">{user.firstName} {user.lastName}</p>
                <p className="font-semibold text-gray-900 py-1">{user.address} область</p>
                <div className="md:flex space-x-4">
                <p className="font-semibold text-gray-900 py-1 pb-2">{user.phoneNumber}</p>
                <div className="md:pt-1.5 flex space-x-3 mb-2">
                    <Viber width="22" height="22" color="black"/>
                    <Telegram width="24" height="24" color="black"/>
                    <Inst width="24" height="24" color="black"/>
                </div>
                </div>
          </a>
          <img className="p-5 rounded-t-lg max-h-[20em]" src="https://placehold.co/80x100" alt="Vacancy image" />
          {location.pathname == "/user/my-services" ? 
            <>
              <DeleteModal id={props.id} type="послугу" obj="services" name={props.serviceName}/>
              <a href={"/service/edit/" + props.id} className="hover:bg-sky-200 rounded-full p-2 inline absolute -top-2 right-8">
              <Edit /></a>
            </> : <ReportForm id={props.id}/>}
          
        </div>
        <p className="font-normal text-gray-700">{props.description}</p>
        <div className="relative flex justify-between py-6">
      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
      </div>
      <button className="flex space-x-2 font-semibold md:text-lg absolute bottom-10 lg:bottom-6 right-0"><span className="hidden sm:flex">Зберігти</span>
          <div className="pl-2 pt-1">
            <HeartOutline color="#b2b2b2"/>
          </div>
        </button>
      </div>
      </div>
    )
}