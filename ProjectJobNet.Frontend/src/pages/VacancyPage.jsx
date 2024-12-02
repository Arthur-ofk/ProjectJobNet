import Verified from "../icons/Verified";
import HeartOutline from "../icons/HeartOutline";
import Edit from "../icons/Edit";

import ReportForm from "../components/modals/ReportForm";
import DeleteModal from "../components/modals/DeleteModal";
import Tag from "/src/components/Tag";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";

export default function VacancyPage(){

  const { id } = useParams();
  const [vacancy, setVacancy] = useState([]);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
     axios.get(`https://localhost:6969/api/jobs/${id}`)
     .then(response => {
          axios.get(`https://localhost:6969/api/users/${response.data.userId}`)
          .then(response => {
            setCompanyName(response.data.firstName); });
            setVacancy(response.data);
      })
      .catch(error => {
          console.error(error);
      });
  }, []);
  
  const saveVacancy = (id) =>{
    const data = {
      employerId: localStorage.getItem("userId"),
      jobId: id
    };
    axios.post("https://localhost:6969/api/SavedJob", data, 
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}}).then();  
  }
  
    return(
       <div className="mx-[5em] md:mx-[7em] max-w-4xl">
       <a href="/vacancies" className="flex mx-4 font-semibold text-lg text-gray-500 hover:underline">
       <svg className="w-3 h-3 rotate-180 inline mt-2 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
       Всі вакансії</a>
       <div className="block px-12 py-6 bg-white border border-gray-200 rounded-3xl shadow mt-6 mb-10">
       <div className="flex justify-between">
          <div className="space-y-1.5">
            <h5 className="mb-2 text-3xl md:text-2xl pt-4 font-bold tracking-tight text-gray-900">{vacancy.title}</h5>
            <p className="font-semibold md:text-xl text-lg text-gray-900 py-1">{vacancy.salary} грн</p>
            <p className="font-semibold md:text-xl text-lg text-gray-900 py-1">{vacancy.location}</p>
            <div className="flex space-x-2.5">
              <p className="font-semibold md:text-xl text-lg text-gray-900 py-1 pb-4">{companyName}</p>
              <div className="pt-2 md:pt-2.5">
              <Verified color="#38bdf8" width="20" height="20"/>
              </div>
          </div>
        </div>
           <div className="relative z-10">
               <a href={"/company/" + vacancy.userId}>
                   <img className="p-5 rounded-t-lg max-h-[24em]" src="https://placehold.co/100x125"
                        alt="Vacancy image"/>
               </a>
               {localStorage.getItem("userId") == vacancy.userId ? 
               <>
                  <DeleteModal id={vacancy.id} type="вакансію" obj="jobs" name={vacancy.title}/>
                  <a href={"/vacancy/edit/" + vacancy.id} className={"hover:bg-sky-200 rounded-full p-2 inline absolute -top-2 right-8"}>
                  <Edit /></a>
               </>  : <ReportForm id={vacancy.id}/>}
           </div>
       </div>
           <div className="max-w-xl grid gap-1 grid-cols-2 md:grid-cols-4">
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
      </div>
      <h5 className="mb-2 text-2xl pt-8 font-bold tracking-tight text-gray-900">Опис вакансії</h5>
      <p className="text-gray-600 mt-4">{vacancy.description}</p>
      <div className="flex space-x-6 py-6">
      <button className="text-white text-lg bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-xl px-5 text-center">Відгукнутися</button>
      {localStorage.getItem("userRole") === "User" && (<button onClick={() => saveVacancy(vacancy.id)} className="flex font-semibold md:text-lg rounded-xl px-3 py-2.5 hover:bg-gray-200"><span className="hidden md:flex">Зберігти</span> 
          <div className="md:pl-3 md:pt-1">
            <HeartOutline />
          </div>
        </button>)}
      </div>
    </div>

    <div className="relative block px-12 py-6 bg-white border border-gray-200 rounded-3xl shadow">
        <div className="flex space-x-3"> 
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Назва компанії</h5>
            <div className="pt-2">
                <Verified color="#38bdf8" width="20" height="20"/>
          </div>
        </div>
        <a href={localStorage.getItem("userId") == vacancy.userId ? "/company" : `/company/${vacancy.userId}`} className="font-semibold hidden md:flex md:absolute md:right-20 md:top-7 md:text-lg rounded-xl md:-mt-3 px-6 py-1.5 border-2 border-sky-400 hover:bg-sky-200">Детальніше 
          <svg className="w-2.5 h-2.5 inline mt-2.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          </a>
        <p className="text-base/2 text-gray-600 mt-4 mb-10 md:mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sollicitudin, turpis quis sagittis vehicula, sem erat semper mauris, nec rutrum turpis dui ac ante. Etiam imperdiet libero sed felis tempus scelerisque eget et urna. </p>
        <a href={localStorage.getItem("userId") == vacancy.userId ? "/company" : `/company/${vacancy.userId}`} className="font-semibold absolute right-8 bottom-4 md:hidden rounded-xl px-6 py-1.5 border-2 border-sky-400 hover:bg-sky-200">Детальніше 
          <svg className="w-2.5 h-2.5 inline -mt-0.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
        </a>
    </div>
    </div>
  )
}