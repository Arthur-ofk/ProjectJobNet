import Vacancy from '../components/Vacancy';
import Pagination from '../components/pageComponents/Pagination';
import SearchBar from "/src/components/pageComponents/SearchBar";
import SortBar from "/src/components/pageComponents/SortBar";
import FormField from "/src/components/pageComponents/FormField";
import Checkbox from '../components/pageComponents/Checkbox';
import MobileSort from "../components/modals/MobileSort";
import MobileFilter from '../components/modals/MobileFilter';

import { useEffect, useState } from 'react';
import axios from 'axios';

const AllVacancies = () => {
    const [vacancies, setVacancies] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
       axios.get('https://localhost:6969/api/categories')
       .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error(error);
        });

        axios.get('https://localhost:6969/api/jobs')
        .then(response => {
             setVacancies(response.data);
         })
         .catch(error => {
             console.error(error);
         });
    }, []);

    return (
        <>
            <SearchBar />
            <div className="mx-[5em] flex justify-between mb-3">
                <p className="max-w-2xl lg:text-2xl text-xl md:ml-[12em] xl:ml-[20em] py-3 md:py-6 font-semibold">Перегляд вакансій</p>
                <div className="flex md:hidden space-x-6">
                    <MobileSort data={vacancies} method={setVacancies}/>
                    <MobileFilter />
                </div>
                <div className="hidden md:flex py-6 xl:pr-16">
                    <SortBar data={vacancies} method={setVacancies}/>
                </div>
            </div>
            <div className="mx-[5em] flex justify-between">
            <div className="hidden md:flex lg:pl-[2em] xl:pl-[8em]">
                <form>
                <p className="max-w-2xl text-lg py-4 font-semibold">Тип зайнятості</p>
                    <Checkbox id="full-time" name="Повна"/>
                    <Checkbox id="part-time" name="Неповна"/>
                <p className="max-w-2xl text-lg pt-4 pb-3 font-semibold">Зарплата</p>
                    <FormField id="min" type="number" name="Від" className="pb-4 flex items-center space-x-3"/>
                    <FormField id="max" type="number" name="До" className="pb-4 flex items-center space-x-3"/>
                <p className="max-w-2xl text-lg py-4 font-semibold">Категорія</p>
                { categories.map(category => 
                        ( <Checkbox key={category.id} 
                                    id={category.id} name={category.categoryName} /> ))}
                <p className="max-w-2xl text-lg py-4 font-semibold">Особливості</p>
                    <Checkbox id="without-expetience" name="Без досвіду"/>
                    <Checkbox id="without-cv" name="Без резюме"/>
                    <Checkbox id="for-students" name="Студентам"/>
                    <Checkbox id="for-persons-with-disabilities" name="Людям з інвалідністю"/>
                    <Checkbox id="part-time" name="Віддалена робота"/>
                <button type="submit" className="mt-6 text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center">Застосувати фільтри</button>
                </form>
            </div>  
            <div className="grid grid-cols-1 gap-6 justify-right md:basis-2/3">
                {vacancies.map((vacancy) => (
                    <Vacancy key={vacancy.id} 
                             id={vacancy.id} title={vacancy.title} salary={vacancy.salary} location={vacancy.location} 
                             description={`${vacancy.description.slice(0, 330)}...`}/>
                ))}
            </div>  
            </div>
            <div className="m-auto flex justify-between">
            <Pagination />
            </div>
        </>
    )
}

export default AllVacancies;