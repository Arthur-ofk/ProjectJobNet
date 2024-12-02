import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function SortBar(props){
    const location = useLocation();
    const [sortType, setSortType] = useState('createdAt-asc');

    useEffect(() => {
        const sortArray = type => {
          let propertyArr = type.split('-');
          const sortProperty = propertyArr[0];
          const sortOrder = propertyArr[1];

          var sorted = [];
          sortOrder === "asc" ? (
            sorted = [...props.data].sort((a, b) => sortProperty === "createdAt" ? 
                                        (Date.parse(a[sortProperty]) - Date.parse(b[sortProperty])) : (a[sortProperty] - b[sortProperty]))
          ) : (
            sorted = [...props.data].sort((a, b) => sortProperty === "createdAt" ? 
                                        (Date.parse(b[sortProperty]) - Date.parse(a[sortProperty])) : (b[sortProperty] - a[sortProperty])
          ));
          props.method(sorted);
        };
        sortArray(sortType);
      }, [sortType]);

   return(
    <div className="max-w-64 mx-auto" onChange={(e) => setSortType(e.target.value)}>
        <select name="sort" className="bg-white border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-sky-400 focus:border-sky-400 block w-full p-2.5 hover:bg-gray-100">
            <option value="createdAt-asc">Від старих до нових</option>
            <option value="createdAt-desc">Від нових до старих</option>
            {location.pathname != "/resumes" && (<>
                <option value={location.pathname === "/vacancies"? "salary-asc" : "price-asc"}>За зростанням зарплати</option>
                <option value={location.pathname === "/vacancies"? "salary-desc" : "price-desc"}>За спаданням зарплати</option>
            </>)}
        </select>
    </div>
   )
}