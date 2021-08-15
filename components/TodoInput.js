import { useMutation } from "@apollo/client"
import {motion } from "framer-motion"
import { useContext, useState } from "react"
import {Loader} from './Todo'
import { ADD_TODOS, TODOS_OF_A_USER, UPDATE_TODOS_BY_TODO_ID } from "../action/actions"
import { Context } from "../AppContext"
import Notify from "./Notify"

function TodoInput({isCompleted, todo, toggle, toUpdate, handleUpdateExpand, todoNum}) {

    const [input, setInput] = useState({
        title: "",
        description: "",
    })

    const {state:{authDetails: {token}}} = useContext(Context)


    const [setTodo, { loading: setTodoLoading}] = useMutation(ADD_TODOS)

    const [updateTodo, {loading: isUpdating}] = useMutation(UPDATE_TODOS_BY_TODO_ID)
    
    
    const addTodo = () => {
        const todoData = {
            id: String(Math.random()),
            user_id: JSON.stringify(token),
            title: input.title,
            description: input.description,            
        }
        setTodo({
            variables: {
                todos : [todoData]
            },
            refetchQueries: [TODOS_OF_A_USER],
            onCompleted: () => {
                toast.success(<Notify>Added successfully!</Notify>)
            },
            onError: () => {
                toast.error(<Notify>Something went wrong!</Notify>)
            }
            
        })
    }

     const handleUpdateTodo = () => {
        updateTodo({
            variables: {
                todoId: todo.id,
                completed: isCompleted,
                title: input.title,
                desc: input.description,
            },
            refetchQueries: [TODOS_OF_A_USER],
            onCompleted: (() => toast.error(<Notify>Updated successfully!</Notify>)),
            onError: (()=> toast.error(<Notify>Something went wrong!</Notify>))
        })
    }

    return (
        <motion.div key="Todo Input" layout variants={toggle} initial='hidden' animate='vissible' exit="hidden" className="relative h-auto w-auto p-4 text-black rounded-lg shadow-sm border-2 border-gray-300 mb-5">
            {toUpdate && <p className="text-base font-semibold text-blue-600 py-3 mb-1">Todo no :- {todoNum}</p>}
                            <input onChange={(e) => setInput(prev=> ({...prev, title: e.target.value }))} value={input.title} className="text-base place w-full bg-transparent border-b-2 font-semibold focus:outline-none border-gray-300 py-3 placeholder-gray-500 mb-4" placeholder="Title" type="text" />
                            <textarea value={input.description} onChange={(e)=>setInput(prev=> ({...prev, description : e.target.value}))} className="mb-2 h-10 text-base bg-transparent border-b-2 border-gray-300 w-full resize-y placeholder-gray-500 font-semibold pt-1  focus:outline-none " placeholder="Add a note" />
            {setTodoLoading ? <Loader/> : <div className="mt-5 flex items-center space-x-3">
                {toUpdate && isUpdating ? <Loader/> :<button onClick={toUpdate ? handleUpdateTodo : addTodo} className="ring-2 hover:scale-95 transform transition-all text-white bg-blue-500 text-sm font-semibold border-none rounded-full px-4 py-2">{toUpdate ? "Update Todo" : "Add Todo"}</button>}
                {toUpdate && <button onClick={() => handleUpdateExpand(false)} className="ring-2 ring-green-500 bg-green-500 text-white hover:scale-95 transform transition-all  text-sm font-semibold border-none rounded-full px-4 py-2">back</button>}
            </div>}
        </motion.div> 
    )
}

export default TodoInput
