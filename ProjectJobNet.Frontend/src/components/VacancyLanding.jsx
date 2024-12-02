import Verified from "../icons/Verified";
import Tag from "./Tag";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function VacancyLanding(props){
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
     axios.get(`https://localhost:6969/api/jobs/${props.id}`)
     .then(response => {
          axios.get(`https://localhost:6969/api/users/${response.data.userId}`)
          .then(response => {
            setCompanyName(response.data.firstName); });
      })
      .catch(error => {
          console.error(error);
      });
  }, []);

  return(
    <div className="block max-w-md px-12 py-6 bg-white border border-gray-200 rounded-3xl shadow hover:bg-gray-100">
        <div className="flex justify-between">
            <a href={"/vacancies/"+ props.id} >
                <h5 className="mb-2 text-2xl pt-4 font-bold tracking-tight text-gray-900 hover:underline">{props.title}</h5>
                <p className="font-semibold text-gray-900 py-1">{props.salary} грн</p>
                <div className="flex space-x-2">
                    <p className="font-semibold text-gray-900 py-1 pb-4">{companyName}</p>
                    <div className="pt-1.5">
                        <Verified color="#38bdf8"/>
                    </div>
                </div>
            </a>
            <a href={"/company/" + props.userId}>
                <img className="p-5 rounded-t-lg max-h-[20em]" src="https://placehold.co/80x100" alt="Vacancy image"/>
            </a>
        </div>
        <p className="font-normal text-gray-700">{props.description}</p>
      <div className="grid gap-2 grid-cols-4 py-6">
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
        <Tag url="#" text="Назва тегу"/>
      </div>
    </div>
  )
}