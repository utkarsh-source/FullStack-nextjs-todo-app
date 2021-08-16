import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { ADD_USER, GET_USER, login } from "../action/actions";
import { _ADD_USER } from "../action/actionType";
import { Context } from "../AppContext";
import { Loader } from "../components/Todo";
import { client } from "../lib/Client";

function Login() {
    const [userLoading, setUserLoading] = useState(false)
    const { dispatch, state: { authDetails: { token, isLoading, userName} } } = useContext(Context)
    const router = useRouter()

    const handleSubmit = (e) => {
        e.preventDefault();
        login(dispatch)
    }
    
    useEffect(() => {
        if (token && userName) {
            async function getUser() {
                setUserLoading(true)
                try {
                    const { data } = await client.query({
                        query: GET_USER,
                        variables: {
                            id: token
                        }
                    })
                    const id = data?.users_by_pk?.id;
                    const name = data?.users_by_pk?.name;
                    if (!id || !name) {
                        await client.mutate({
                            mutation: ADD_USER,
                            variables: {
                                id: token,
                                name: userName,
                            },
                        })
                    }
                    router.push('/')
                    setUserLoading(false)
                } catch (e) {
                    setUserLoading(false)
                    console.log(e)
                    router.push('/login')
                }
            }
            getUser()
        }
    }, [token, userName])


    return (
        <section className="p-2 w-screen h-screen relative flex items-center justify-center">
            <form onSubmit={handleSubmit} className="md:w-2/6 md:h-2/6 w-full h-full flex ring-2 border-2 border-blue-600 flex-col items-center justify-center rounded-md shadow-md">
                <h1 className="text-lg font-semibold mb-5">Please log in to continue</h1>
                {isLoading || userLoading ? <Loader/> : <button type='submit' className="ring-4 px-7 mt-5 hover:scale-105 transform transition-all py-3 rounded-full bg-blue-600 text-white text-base font-semibold">Log In</button>}
            </form>
        </section>
    )
}

export default Login
