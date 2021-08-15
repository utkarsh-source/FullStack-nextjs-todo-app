import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion"
import { Fragment, useContext, useEffect, useState } from "react"
import {FaPlus, FaSignOutAlt} from 'react-icons/fa'
import TodoItem from "./TodoItem"
import { useMutation, useQuery} from '@apollo/client'
import {DELETE_ALL_TODOS, DELETE_COMPLETED_TODOS, logout, TODOS_OF_A_USER } from "../action/actions"
import { default as L } from 'react-loading';
import { Context } from "../AppContext"
import {toast } from 'react-toastify';
import Notify from "./Notify"
import TodoInput from "./TodoInput"

toast.configure()

export const Loader = ({className}) => {
    return <L className={className} type='spin' color="green" width={25} height={25}/>
}



function Todo() {
    
    const { dispatch, state: { authDetails: { token } } } = useContext(Context)
    
    
    const { data, loading: todosLoading, error } = useQuery(TODOS_OF_A_USER, {
        variables: {
            id: JSON.stringify(token)
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
            scale: 0.8,
            opacity: 0,
        },
        vissible: {
            scale: 1,
            opacity: 1,
        },
        transition: {
                    type: 'tween',
                    duration: 0.25
                }
    }


    
        
    return (
        <section className="bg-yellow-100 bg-opacity-30 md:w-full w-screen md:py-5 min-h-screen relative flex md:items-center justify-center ">
            <AnimateSharedLayout >
            <motion.div layout transition={{type:"tween" , duration: 0.2}} className="relative md:w-1/2 w-full h-auto border-2 border-gray-100 rounded-lg shadow-lg px-2 py-4">
                    <motion.h1 layout className="relative  flex items-center justify-center text-center font-semibold text-xl mb-8 py-3">Real Time Todo <button onClick={openInputBox} className="focus:outline-none absolute h-8 w-8  right-0 top-1/2 transform -translate-y-1/2 rounded-3xl bg-blue-500 grid cursor-default place-content-center">
                        <FaPlus className={`${isOpen && "rotate-45 duration-300"} active:scale-95 transform text-white font-semibold text-base transition-transform`} /></button>
                        <FaSignOutAlt onClick={()=>logout(dispatch)} aria-label="logout button" className="hover:scale-110 absolute top-1/2 transform -translate-y-1/2 left-0 text-3xl cursor-pointer text-red-500"/>
                    </motion.h1>
                <AnimatePresence>
                        {isOpen &&
                            <motion.div layout><TodoInput toggle={toggle}/></motion.div> 
                        }
                    </AnimatePresence>
                    <motion.p layout transition={{type:"tween" , duration: 0.2}} className="flex px-2 space-x-4 justify-end w-full mt-8">{isDeletingAllTodo ? <Loader /> : <motion.button transition={{type:"tween" , duration: 0.2}} layout onClick={deleteAllTodos} className={`${todosDetails.length < 1 && "hidden"} text-white bg-blue-500 px-4 py-1 rounded-full text-sm font-semibold `}>Delete all : {todosDetails.length}</motion.button>} {todosDetails.completedTodos >= 1 && isDeletingCompletedTodo ? <Loader /> : <button onClick={deleteCompletedTodos} className={`${todosDetails.completedTodos <1 && "hidden"} text-white bg-green-500 px-4 py-1 rounded-full text-sm font-semibold `}>Delete completed : {todosDetails.completedTodos}</button>}</motion.p>
                <motion.div layout transition={{type:"tween" , duration: 0.2}}  className="relative w-auto grid grid-cols-1 gap-y-3 py-4">
                    {todosLoading ? <Loader className="mx-auto text-2xl"/> : !todos?.length ? <p className="text-center text-blue-500 text-lg font-semibold border-2 border-gray-300 shadow-md rounded-md py-5">Ops : No Tasks yet!</p> : todos.map((todo, index) => {
                        return (
                            <Fragment key={todo.id}>
                                <TodoItem todosLoading={todosLoading} todoNum={index+1} Loader={Loader} variants={toggle} todo={todo}/>
                            </Fragment>
                        )
                    })}
                </motion.div>
                </motion.div>
            </AnimateSharedLayout>
        </section>
    )
}

export default Todo
