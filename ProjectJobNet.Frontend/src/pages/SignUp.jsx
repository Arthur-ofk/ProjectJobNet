import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

export default function SignUp(){
    const navigate = useNavigate();

    const [register, setRegisterData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        username: "",
        dateOfBirth: "2024-11-28T11:39:15.724Z",
        phoneNumber: "",
        city: "",
        region: "",
        email: "",
        password: ""
      });

      const handleChange = (e) => {
        const value = e.target.value;
        setRegisterData({
          ...register,
          [e.target.name]: value
        });
      };    

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            firstName: register.firstName,
            lastName: `${register.middleName} ${register.lastName}`,
            username: register.username,
            phoneNumber: register.phoneNumber,
            address: `${register.city}, ${register.region}`,
            email: register.email,
            password: register.password
          };
        axios.post("https://localhost:6969/api/Auth/register", userData).then((response) => {
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.user.id);
            localStorage.setItem("isLoggedIn", true);
            axios.get(`https://localhost:6969/api/roles/${response.data.user.roleId}`, 
                { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}}
            ).then((response) => 
                localStorage.setItem("userRole", response.data.roleName))
            navigate("/");
          });  
    }

    const { role } = useParams();

    return(
        <>
            <a href={role === "user" ? "/signup/company" : "/signup/user"} className="absolute top-24 right-0 font-bold text-gray-500 hover:underline pt-4 pr-[4em] md:pr-[5em]">Зареєструватися як {role == "user" ? "роботодавець >" : "шукач роботи >"}</a>
            <div className="bg-white mx-auto mt-4 py-4 w-9/12 md:w-8/12 border rounded-3xl shadow">
            <form className="md:mx-[3em] mx-[2em] mt-8 space-y-4" onSubmit={handleSubmit}>
            <h1 className="font-medium text-xl pb-2">Реєстрація</h1>
                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    {role == "user" 
                    ? <>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 ml-1">Ім'я</label>
                            <input type="text" name="firstName" value={register.firstName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 ml-1">Прізвище</label>
                            <input type="text" name="lastName" value={register.lastName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                        </div>
                    </> : <>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 ml-1">Назва компанії</label>
                            <input type="text" name="firstName" value={register.firstName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 ml-1">Реєстраційний номер</label>
                            <input type="text" name="lastName" value={register.lastName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                        </div>
                    </> }
                </div>
                    {role == "user" 
                    ? <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">По-батькові</label>
                        <input type="text" name="middleName" value={register.middleName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" />
                    </div> : <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Власник</label>
                        <input type="text" name="middleName" value={register.middleName} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>}

                <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Місто</label>
                        <input type="text" name="city" value={register.city} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Область</label>
                        <input type="text" name="region" value={register.region} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1"> Ім'я користувача/Username</label>
                        <input type="text" name="username" value={register.username} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Номер телефону</label>
                        <input type="text" name="phoneNumber" value={register.phoneNumber} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Електрона пошта</label>
                        <input type="text" name="email" value={register.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-900 ml-1">Пароль</label>
                        <input type="password" name="password" value={register.password} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block w-full p-2" required />
                    </div>
                    <div className="flex items-start mb-6">
                    <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-sky-300" required />
                    </div>
                    <label for="remember" className="ms-2 font-medium text-gray-900">Я погоджуюсь з <a href="#" className="text-sky-500 hover:underline">умовами використання</a>.</label>
                </div>
                <button type="submit" className="text-white bg-sky-400 hover:bg-sky-600 focus:ring-4 focus:outline-none focus:ring-sky-300 font-medium rounded-lg w-full sm:w-auto px-5 py-2.5 text-center">Зареєструватися</button>
            
            </form>
        </div>
        </>
    )
}