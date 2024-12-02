import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import DeleteIcon from '../../icons/DeleteIcon'

export default function DeleteModal(props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const type = props.obj;

  const handleClick = (id) => {
      axios.delete(`https://localhost:6969/api/${type}/${id}`, 
          { headers: {"Authorization" : `Bearer ${localStorage.getItem('token')}`}})
      .then(response => {
        console.log(response + `Deleted from ${type} with ID ${id}`);
      })
      .catch(error => {
        console.error(error);
      });
      setOpen(false);
      switch(type) {
        case "posts":
          localStorage.getItem("userRole") === "User" && navigate("/user/my-blog");
          localStorage.getItem("userRole") === "Company" && navigate("/company/my-blog")
          break;
        case "jobs":
          navigate("/company/my-vacancies") ;
          break;
        default:
          navigate(`/user/my-${type}`)
      }
  }

  return (
    <>
        <button onClick={() => setOpen(true)} className="inline absolute -top-3 -right-4 hover:bg-red-300 rounded-full p-3"> <DeleteIcon /> </button>

    <Dialog open={open} onClose={setOpen} className="relative z-30">
      <DialogBackdrop transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"/>

      <div className="fixed inset-0 z-60 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-md data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                >
                <div className="flex items-center justify-between rounded-t border-b py-3 md:py-4 px-5">
                    <DeleteIcon />
                    <h3 className="text-xl ml-2 font-semibold text-gray-900">Повідомити про порушення</h3>
                    <button type="button" data-autofocus onClick={() => setOpen(false)} className="end-2.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900">
                        <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="mt-2 px-5">
                    <p className="text-gray-700">
                      Ви впевнені, що хочете видалити {props.type} {props.name}? Ця дія не може бути скасована.
                    </p>
                  </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" onClick={() => handleClick(props.id)}
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
                Видалити
              </button>
              <button type="button" data-autofocus onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
                Скасувати
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    </>
  )
}
