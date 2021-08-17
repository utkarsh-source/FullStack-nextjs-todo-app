import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { Fragment, useContext, useState } from "react"
import {FaPlus, FaSignOutAlt} from 'react-icons/fa'
import TodoItem from "./TodoItem"
import { useMutation, useQuery} from '@apollo/client'
import {DELETE_ALL_TODOS, DELETE_COMPLETED_TODOS, logout, TODOS_OF_A_USER } from "../action/actions"
import { default as L } from 'react-loading';
import { Context } from "../AppContext"
import TodoInput from "./TodoInput"


export const Loader = ({className}) => {
    return <L className={className} type='spin' color="blue" width={18} height={18}/>
}



function Todo() {
    
    const { dispatch, state: { authDetails: { token } } } = useContext(Context)
    
    
    const { data, loading: todosLoading, error } = useQuery(TODOS_OF_A_USER, {
        variables: {
            id: token
        },
    })

    const [deleteCompletedTodos, { loading: isDeletingCompletedTodo }] = useMutation(DELETE_COMPLETED_TODOS, {
        refetchQueries: [TODOS_OF_A_USER]
    })
    const [deleteAllTodos, { loading: isDeletingAllTodo }] = useMutation(DELETE_ALL_TODOS, {
        refetchQueries: [TODOS_OF_A_USER]
    })

    const todos = data?.users_by_pk?.todos

    const todosDetails = {
        completedTodos: todos?.filter(item => item.is_completed === true).length,
        length: todos?.length
    }


    const [isOpen, setIsOpen] = useState(false)

    const openInputBox = () => {
        setIsOpen(!isOpen)
    }


    const toggle = {
        hidden: {
            scale: 0.9,
            opacity: 0,
        },
        vissible: {
            scale: 1,
            opacity: 1,
        },
    }


    
        
    return (
        <section className="bg-white  md:w-full w-screen md:py-5 min-h-screen relative flex md:items-center justify-center ">
            <AnimateSharedLayout >
            <motion.div layout className="relative md:w-1/2 w-full h-auto border-2 bg-gray-50 bg-opacity-50 border-gray-100 rounded-2xl shadow-lg px-6 py-4">
                    <motion.h1 layout className="relative flex items-center justify-between text-center font-semibold text-3xl mb-8 pb-3"><span>T<span className="text-blue-600">o</span>D<span className="text-blue-600">oo</span></span>
                        <div className="flex items-center space-x-4 px-4 py-2 border-2 shadow-sm border-gray-300 rounded-full">
                            <FaSignOutAlt onClick={()=>logout(dispatch)} aria-label="logout button" className="hover:scale-110 text-3xl cursor-pointer text-red-500"/>
                            <button onClick={openInputBox} className="focus:outline-none h-8 w-8 rounded-full bg-blue-500 grid cursor-default place-content-center">
                            <FaPlus className={`${isOpen && "rotate-45 duration-300"} active:scale-95 transform text-white font-semibold text-base transition-transform`} /></button>
                        </div>
                    </motion.h1>
                <AnimatePresence>
                        {isOpen &&
                            <motion.div layout><TodoInput toggle={toggle}/></motion.div> 
                        }
                    </AnimatePresence>
                    <motion.p layout className="flex space-x-4 justify-end w-full my-6">{isDeletingAllTodo ? <Loader /> :todosDetails.length >= 1 &&  <motion.button layout onClick={deleteAllTodos} className={`inline-block text-white bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold `}>Delete all : {todosDetails.length}</motion.button>} {isDeletingCompletedTodo ? <Loader /> : todosDetails.completedTodos >= 1 && <button onClick={deleteCompletedTodos} className={`${todosDetails.completedTodos <1 && "hidden"} text-white bg-green-500 px-4 py-2 rounded-full text-sm font-semibold inline-block`}>Delete completed : {todosDetails.completedTodos}</button>}</motion.p>
                    <div className="relative w-fujll grid grid-cols-1  gap-y-6">
                        {todosLoading ? <Loader className="mx-auto text-2xl"/> : !todos?.length ? <p className="text-center text-blue-500 text-lg font-semibold border-2 border-gray-300  rounded-md py-5">Ops : No Tasks yet!</p> : todos.map((todo, index) => {
                            return (
                                <Fragment key={todo.id}>
                                    <TodoItem todosLoading={todosLoading} todoNum={index+1} Loader={Loader} variants={toggle} todo={todo}/>
                                </Fragment>
                            )
                        })}
                    </div>
                </motion.div>
            </AnimateSharedLayout>
        </section>
    )
}

export default Todo
