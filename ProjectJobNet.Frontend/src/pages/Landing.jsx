import BlogPost from "/src/components/BlogPost";
import SearchBar from "/src/components/pageComponents/SearchBar";
import ServiceLanding from "/src/components/ServiceLanding";
import VacancyLanding from "/src/components/VacancyLanding";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Landing() {
  const [vacancies, setVacancies] = useState([]);
  const [services, setServices] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:6969/api/jobs')
      .then(response => {
           setVacancies(response.data);
     })
      .catch(error => {
           console.error(error);
      });

    axios.get('https://localhost:6969/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    axios.get('https://localhost:6969/api/posts')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error(error);
      });  
    }, []);
    
    return (
      <>
        <SearchBar />
        <div className="flex justify-between">
          <Heading text="Вакансії" />
          <ShowAllButton url="/vacancies" />
        </div>
        <div className="flex justify-center px-[5em] pb-12 grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {vacancies.slice(0, 3).map((vacancy) => (
                    <VacancyLanding key={vacancy.id} 
                             id={vacancy.id} title={vacancy.title} salary={vacancy.salary} description={`${vacancy.description.slice(0, 150)}...`}/>
                ))}
        </div>
        <div className="flex justify-between">
          <Heading text="Одноразові послуги" />
          <ShowAllButton url="/services" />
        </div>
        <div className="flex justify-center px-[5em] pb-12 grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {services.slice(0, 3).map((service) => (
                    <ServiceLanding key={service.id} 
                        id={service.id} serviceName={service.serviceName} price={service.price} description={`${service.description.slice(0, 150)}...`} />
                ))}
        </div>
        <Heading text="Про нас" />
        <p className="px-[6em] pb-12 text-center">
          {" "}
          JobNet - це студентський проєкт. <br />
          Основна мета проекту – надати користувачам можливість працювати зі ефективним сервісом з інтуїтивним сучасним інтерфейсом, 
          який допоможе з’єднувати роботодавців з потенційними працівниками. 
          Крім того, він буде цікавий для людей, які бажають заробити на короткострокових або разових замовленням.
        </p>
        <div className="flex justify-between">
          <Heading text="Блог" />
          <ShowAllButton url="/blog" />
        </div>
        <div className="flex justify-center px-[5em] grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        {posts.slice(0, 4).map((post) => (
                    <BlogPost key={post.id} 
                        id={post.id} serviceName={post.title} content={`${post.content.slice(0, 70)}...`} />
                ))}
        </div>
      </>
    );
}


function ShowAllButton(props){
  return(
    <a href={props.url} className="sm:text-lg font-semibold text-gray-500 hover:underline pr-[7em] pt-10">Переглянути більше
      <div className="inline px-2">
          <svg className="w-3 h-3 rtl:rotate-180 inline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
          </svg>
      </div>
    </a>
  )
}

function Heading(props){
  return(
    <p className="max-w-2xl lg:text-2xl text-xl px-[5em] py-8 font-semibold">{props.text}</p>
  )
}