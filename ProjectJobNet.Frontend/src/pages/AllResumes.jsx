import Resume from '../components/Resume';
import Pagination from '../components/pageComponents/Pagination';
import SearchBar from "/src/components/pageComponents/SearchBar";
import SortBar from "/src/components/pageComponents/SortBar";
import Checkbox from '../components/pageComponents/Checkbox';
import MobileSort from "../components/modals/MobileSort";
import MobileFilter from '../components/modals/MobileFilter';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AllResumes(){

    const [categories, setCategories] = useState([]);
    const [resumes, setResumes] = useState([]);

    useEffect(() => {
       axios.get('https://localhost:6969/api/categories')
       .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        axios.get('https://localhost:6969/api/resumes')
        .then(response => {
             setResumes(response.data);
         })
         .catch(error => {
             console.error(error);
         });
    }, []);
    
    return (
        <>
            <SearchBar />
            <div className="mx-[5em] flex justify-between mb-3">
                <p className="max-w-2xl lg:text-2xl text-xl md:ml-[12em] xl:ml-[20em] py-3 md:py-6 font-semibold">Перегляд резюме</p>
                <div className="flex md:hidden space-x-1">
                    <MobileSort data={resumes} method={setResumes}/>
                    <MobileFilter />
                </div>
                <div className="hidden md:flex py-6 xl:pr-16">
                    <SortBar data={resumes} method={setResumes}/>
                </div>
            </div>
            <div className="mx-[5em] flex justify-between">
            <div className="hidden md:flex lg:pl-[2em] xl:pl-[8em] overflow-y-auto">
                <form>
                <p className="max-w-2xl text-lg py-4 font-semibold">Категорія</p>
                { categories.map(category => 
                        ( <Checkbox key={category.id} id={category.id} name={category.categoryName} /> ))}
                    <p className="max-w-2xl text-lg py-4 font-semibold">Місто</p>
                    <Checkbox id="dnipro" name="Дніпро"/>
                    <Checkbox id="kyiv" name="Київ"/>
                    <Checkbox id="lviv" name="Львів"/>
                    <Checkbox id="poltava" name="Полтава"/>
                    <Checkbox id="chernivtsi" name="Чернівці"/>
                    <Checkbox id="kharkiv" name="Харків"/>
                <button type="submit" className="mt-6 text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center">Застосувати фільтри</button>
                </form>
            </div>  
            <div className="grid grid-cols-1 gap-6 justify-right md:basis-2/3">
                {resumes.map((resume) => (
                    <Resume key={resume.id} id={resume.id} title={resume.title} content={`${resume.content.slice(0, 330)}...`}/>
                ))}
            </div>  
            </div>
            <div className="m-auto flex justify-between">
            <Pagination />
            </div>
        </>
    )
}