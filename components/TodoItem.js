import { useMutation } from '@apollo/client';
import { AnimatePresence, motion } from 'framer-motion'
import {useState } from 'react'
import { FaCheckCircle, FaChevronDown, FaPenAlt, FaTrashAlt } from 'react-icons/fa'
import { COMPLETED_TODO, DELETE_TODOS_BY_TODO_ID, TODOS_OF_A_USER } from '../action/actions';
import TodoInput from './TodoInput';



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
        })
    }

    return (
        <>
            <AnimatePresence>
                        <motion.div key="title" layout className={`relative flex ${isExpanded && "ring-blue-500 "}  items-center py-5 ring-2 ring-gray-300 shadow-sm w-full bg-white rounded-full px-6`}>
                            {isUpdating ? <Loader/> : <FaCheckCircle onClick={handleCompleteTodo} className={`${!todosLoading &&todo.is_completed && "text-blue-500"} ring-2 ring-blue-500 cursor-pointer hover:scale-105 active:scale-95 transform rounded-full text-lg font-semibold text-transparent `} />}
                            <p className={`ml-3 relative font-semibold px-2 text-base`}>{todo.title}
                            </p>
                            <span className="ml-auto inline-flex space-x-4 items-center">
                                <FaChevronDown onClick={handleExpand} className={`${isExpanded && "rotate-180 duration-200 transition-transform"} 
                        text-xl transform  select-none hover:scale-125 font-semibold text-blue-500 `} />
                                <FaPenAlt onClick={() => handleUpdateExpand(true)} className="text-indigo-500 text-lg transform hover:scale-125" />
                                {isDeleting ? <Loader /> : <FaTrashAlt onClick={handleDeleteTodo} className="text-red-600 text-lg transform hover:scale-125" />}
                            </span>
                        </motion.div>
                    {isExpanded &&
                    <motion.p layout key="description" variants={variants} animate="vissible" initial="hidden" exit="hidden" className="border-2 border-gray-300 font-semibold text-gray-500 text-sm rounded-2xl px-4 py-5 ">
                    <span className="block text-blue-500 text-sm font-semibold pb-2">Date</span>
                    {new Date(todo.created_at).toLocaleDateString("en-US", { dateStyle: "long" })}
                            <span className="block text-blue-500 text-sm font-semibold mt-4 py-2">Description</span>
                            {todo.description}
                        </motion.p>
                    }
                    {toggledUpdateBox && <motion.div key="update todo box" layout className="mt-3"> <TodoInput todo={todo} isCompleted={isCompleted} todoNum={todoNum} handleUpdateExpand={handleUpdateExpand} toggle={variants} toUpdate/></motion.div>}
            </AnimatePresence>
        </>
    )
}

export default TodoItem
