import { useMutation } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaPenAlt, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify';
import { COMPLETED_TODO, DELETE_TODOS_BY_TODO_ID, TODOS_OF_A_USER, UPDATE_TODOS_BY_TODO_ID } from '../action/actions';
import Notify from './Notify';
import TodoInput from './TodoInput';



toast.configure()

function TodoItem({ todosLoading, todo, variants, Loader, todoNum}) {

    const [isExpanded, setExpand] = useState(false);
    const [toggledUpdateBox, setUpdateExpand] = useState(false);

    const [deleteTodo, { loading: isDeleting }] = useMutation(DELETE_TODOS_BY_TODO_ID)
    const [updateTodo, { data, loading: isUpdating }] = useMutation(COMPLETED_TODO)
    const isCompleted = data?.update_todos_by_pk?.is_completed

    const handleDeleteTodo = () => {
        deleteTodo({
            variables: {
                todoId: todo.id
            },
            refetchQueries: [TODOS_OF_A_USER],
            onCompleted: (data) => {
                console.log(data)
                toast.error(<Notify>Deleted successfully!</Notify>)
            },
            onError: () => {toast.error(<Notify>Something went wrong!</Notify>)}
        })
    }

    const handleExpand = () => {
        setExpand(!isExpanded)
    }
    const handleUpdateExpand = (shouldOpen = false) => {
        setUpdateExpand(shouldOpen)
    }
    const handleCompleteTodo = () => {
        updateTodo({
            variables: {
                todoId: todo.id,
                completed: !todo.is_completed
            },
            refetchQueries: [TODOS_OF_A_USER],
            onCompleted:(()=>console.log('completed'))
        })
    }

    
    const line_through = {
        hide: {
            scaleX: 0,
            originX: 0,
        },
        show: {
            scaleX: 1
        }
    }

    return (
        <>
            <AnimatePresence>
                        <motion.div key="title" transition={{type:"tween" , duration: 0.2}} layout className={`relative flex ${isExpanded && "ring-2 border-blue-500"} items-center py-5 shadow-sm w-full border-2 border-gray-300 rounded-2xl px-4`}>
                            {isUpdating ? <Loader/> : <FaCheckCircle onClick={handleCompleteTodo} className={`${!todosLoading &&todo.is_completed && "text-blue-500"} ring-2 ring-blue-500 cursor-pointer hover:scale-105 active:scale-95 transform rounded-full text-lg font-semibold text-transparent `} />}
                            <p className={`ml-3 relative font-semibold px-2 text-base`}>{todo.title}
                                <motion.span transition={{type:"tween" , duration: 0.2}} variants={line_through} animate={`${(!todosLoading && todo.is_completed) ? 'show' : 'hide'}`}  className="block absolute w-full left-0 top-1/2 rounded-full -translate-y-1/2 h-0.5 bg-blue-500" ></motion.span>
                            </p>
                            <span className="ml-auto inline-flex space-x-4 items-center">
                                <FaChevronDown onClick={handleExpand} className={`${isExpanded && "rotate-180 duration-200"} 
                        text-xl transform transition-transform select-none hover:scale-125 font-semibold text-blue-500 `} />
                                <FaPenAlt onClick={() => handleUpdateExpand(true)} className="text-indigo-500 text-lg cursor-pointer transform hover:scale-125" />
                                {isDeleting ? <Loader /> : <FaTrashAlt onClick={handleDeleteTodo} className="text-red-600 text-lg cursor-pointer transform hover:scale-125" />}
                            </span>
                        </motion.div>
                    {isExpanded &&
                    <motion.p layout transition={{ type: "tween", duration: 0.2 }} key="description" variants={variants} animate="vissible" initial="hidden" exit="hidden" className="border-2 border-gray-300 font-semibold text-gray-500 text-sm rounded-2xl px-4 py-5 ">
                    <span className="block text-blue-500 text-sm font-semibold pb-2">Date</span>
                    {new Date(todo.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}
                            <span className="block text-blue-500 text-sm font-semibold mt-4 py-2">Description</span>
                            {todo.description}
                        </motion.p>
                    }
                    {toggledUpdateBox && <motion.div transition={{type:"tween" , duration: 0.2}} key="update todo box" layout className="mt-3"> <TodoInput todo={todo} isCompleted={isCompleted} todoNum={todoNum} handleUpdateExpand={handleUpdateExpand} toggle={variants} toUpdate/></motion.div>}
            </AnimatePresence>
        </>
    )
}

export default TodoItem
