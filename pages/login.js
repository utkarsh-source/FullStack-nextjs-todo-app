import { useMutation } from "@apollo/client";
import { route } from "next/dist/next-server/server/router";
import router, { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { ADD_USER, login } from "../action/actions";
import { _ADD_USER } from "../action/actionType";
import { Context } from "../AppContext";
import { Loader } from "../components/Todo";

function Login() {

    const { dispatch, state: { authDetails: { userName, token} } } = useContext(Context)
    const [addUser, { data, error, loading }] = useMutation(ADD_USER)
    const name = data?.insert_users_one?.name
    const id = data?.insert_users_one?.id
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault();
        login(dispatch)
    }


    useEffect(() => {
        if (token && userName) {
            addUser({
                variables: {
                    id: JSON.stringify(token),
                    name: userName,
                },
                onCompleted: (()=>console.log('completed'))
            })
        }
    }, [token])
    
    useEffect(() => {
        if (!loading && name && id) {
            router.push('/')
        }
    },[name, loading])


    return (
        <section className="p-2 w-screen h-screen relative flex items-center justify-center">
            <form onSubmit={handleSubmit} className="md:w-2/6 md:h-2/6 w-full h-full flex ring-2 border-2 border-blue-600 flex-col items-center justify-center rounded-md shadow-md">
                <h1 className="text-lg font-semibold mb-5">Please log in to continue</h1>
                {loading ? <Loader/> : <button type='submit' className="ring-4 px-7 mt-5 hover:scale-105 transform transition-all py-3 rounded-full bg-blue-600 text-white text-base font-semibold">Log In</button>}
            </form>
        </section>
    )
}

export default Login
