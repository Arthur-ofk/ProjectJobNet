import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ServiceForm(){

    const { action, id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    useEffect(() => {
        axios.get('https://localhost:6969/api/categories')
        .then(response => {
             console.log(response.data);
             setCategories(response.data);
         })
         .catch(error => {
             console.error(error);
         });
     }, []);
     
    const [service, setService] = useState({
        serviceName: "",
        price: "",
        description: "",
        categoryId: ""
      }); 
  
    const handleChange = (e) => {
    const value = e.target.value;
    setService({
      ...service,
      [e.target.name]: value
    });
  };    

const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
        userId: localStorage.getItem("userId"),
        categoryId: service.categoryId,
        serviceName: service.serviceName,
        description: service.description,
        price: service.price
      };
    axios.post("https://localhost:6969/api/services", userData, 
        { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}}).then(
            navigate("/user/my-services/")
      );  
    }

    if(action === "edit") {
        useEffect(() => {
            axios.get(`https://localhost:6969/api/services/${id}`)
            .then(response => {
                setService(response.data);
             })
             .catch(error => {
                 console.error(error);
             });
         }, []);
    }

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        const userData = {
            userId: service.userId,
            categoryId: service.categoryId,
            serviceName: service.serviceName,
            description: service.description,
            price: service.price
          };
        axios.put(`https://localhost:6969/api/services/${id}`, userData, 
            { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}}).then(
                navigate(`/services/${id}`)
          );  
        }

    return(
        <div className="bg-white mx-auto py-4 w-9/12 md:w-8/12 border rounded-3xl shadow">
            <form className="md:mx-[3em] mx-[2em] mt-8 space-y-4" onSubmit={action == "create" ? handleSubmit : handleUpdateSubmit}>
            <h1 className="font-medium text-xl pb-2">{action == "create" ? "Створення" : "Редагування"} послуги</h1>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ml-1">Назва послуги</label>
                    <input type="text" name="serviceName" value={service.serviceName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />    
                </div>
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 ml-1">Прогодинна вартість</label>
                    <input type="number" step=".01" name="price" value={service.price} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" placeholder="0.00" required />    
                </div>
                <div>
                    <label className="block mb-2 font-medium text-gray-900">Категорія:</label>
                    <select name="categoryId" value={service.categoryId} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-400 focus:border-sky-400 block w-full p-2 hover:bg-gray-100">
                    { categories.map( category => 
                        ( <option key={category.id} value={category.id}> {category.categoryName} </option> ))}
                    </select>                
                </div>
               <div>
                    <label className="block mb-2 font-medium text-gray-900">Опис послуги:</label>
                    <textarea name="description" value={service.description} onChange={handleChange} rows="15" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-sky-500 focus:border-sky-500" placeholder="Write your thoughts here..."></textarea>
                </div>
                <button type="submit" className="text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg w-full sm:w-auto px-10 py-2.5 text-center">{action === "create" ? "Створити" : "Оновити"}</button>
            </form>
        </div>
    )
}