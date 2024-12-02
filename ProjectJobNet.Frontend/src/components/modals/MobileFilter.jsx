import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import { useLocation } from "react-router-dom";
import axios from 'axios';

import Checkbox from '../pageComponents/Checkbox';
import FormField from "../pageComponents/FormField";
import Filter from "/src/icons/Filter";

export default function MobileFilter(){
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
       axios.get('https://localhost:6969/api/categories')
       .then(response => {
            setCategories(response.data);
        })
        .catch(error => {
            console.error(error);
        });
    }, []);
  
    return (
    <>
        <button onClick={() => setOpen(true)} className="hover:bg-sky-200 rounded-full px-3"> <Filter width="21" height="21"/> </button>

            <Dialog open={open} onClose={setOpen} className="relative z-30">
                <DialogBackdrop transition 
                    className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>
                <div className="fixed inset-0 z-60 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center items-center sm:p-0">
                    <DialogPanel
                    transition
                    className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in my-8 w-8/12 max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                    <div className="flex items-center justify-between p-4 border-b rounded-t">
                        <h3 className="text-xl font-semibold text-gray-900">
                            Фільтрування
                        </h3>
                        <button type="button" data-autofocus onClick={() => setOpen(false)} className="end-2.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900" data-modal-hide="authentication-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>

                    <div className="px-6 py-4">
                    <form>
                       <div className="overflow-auto h-80">
                       {location.pathname != "/resumes" && (<>
                       <p className="max-w-2xl text-lg pb-4 font-semibold">Тип зайнятості</p>
                            <Checkbox id="full-time" name="Повна"/>
                            <Checkbox id="part-time" name="Неповна"/>
                        <p className="max-w-2xl text-lg pt-4 pb-3 font-semibold">Зарплата</p>
                            <FormField id="min" type="number" name="Від" className="pb-4 flex items-center space-x-3 w-72" isRequired = {false}/>
                            <FormField id="max" type="number" name="До" className="pb-4 flex items-center space-x-3 w-72" isRequired = {false}/>
                        <p className="max-w-2xl text-lg py-4 font-semibold">Категорія</p>
                        </>)}
                        { categories.map(category => 
                        ( <Checkbox key={category.id} id={category.id} name={category.categoryName} /> ))}
                        <p className="max-w-2xl text-lg py-4 font-semibold">Особливості</p>
                            <Checkbox id="without-expetience" name="Без досвіду"/>
                            <Checkbox id="without-cv" name="Без резюме"/>
                            <Checkbox id="for-students" name="Студентам"/>
                            <Checkbox id="for-persons-with-disabilities" name="Людям з інвалідністю"/>
                            <Checkbox id="part-time" name="Віддалена робота"/>
                       </div>
                        <button type="submit" className="mt-6 text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center">Застосувати фільтри</button>
                    </form>
                    </div>
            </DialogPanel>
          </div>
        </div>
            </Dialog>
    </>
    )
}