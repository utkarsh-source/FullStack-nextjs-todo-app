import auth from '../Firebase/clientApp'
import firebase from 'firebase/app'
import { LOGIN_FAIL, LOGIN_REQUEST, LOGIN_SUCCESS, LOGOUT } from './actionType'
import { client } from '../lib/Client'
import { gql } from '@apollo/client'



export async function login(dispatch) {
        try {
            dispatch({type : LOGIN_REQUEST})
            const provider = await new firebase.auth.GoogleAuthProvider()
            const authDetails = await auth.signInWithPopup(provider)
            const accessToken = authDetails.credential.accessToken
            const profile = {
                name : authDetails.additionalUserInfo.profile.name,
                profileUrl : authDetails.additionalUserInfo.profile.picture,
            }
            
            sessionStorage.setItem("token", accessToken)
            sessionStorage.setItem("user", JSON.stringify(profile))
            dispatch({ type: LOGIN_SUCCESS, payload: { accessToken, profile } })
        } catch (error) {
            dispatch({type : LOGIN_FAIL, payload : error.message})
        }
}

export async function logout(dispatch) {
    try {
            await auth.signOut()
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('user')
            dispatch({ type: LOGOUT })
        }
        catch (err) {
            console.log(JSON.stringify(err))
        }
}


export const ADD_USER = gql`
   mutation addUser($id: String!, $name :String){
  insert_users_one(object :{id:$id, name:$name}){
    id
    name
    created_at
  }
}
`

export const USER_BY_ID = gql`
    query userById($id :String!){
        users_by_pk(id :$id){
        id
        name
        created_at
        todos{
        id
        user_id
        created_at
        title
        description
        is_completed
    }
  }
}
`

export const ADD_TODOS = gql`
    mutation($todos: [todos_insert_input!]!){
        insert_todos(objects : $todos){
            returning{
            id
            user_id
            title
            description
            is_completed
            created_at
            }
    }
}
`

export const UPDATE_TODOS_BY_TODO_ID = gql`
    mutation updateTodo($todoId :String!, $desc: String!, $title: String!) {
        update_todos_by_pk(pk_columns: {id: $todoId}, _set: {description: $desc, title: $title}){
            id
            user_id
            title
            description
            created_at
        }
    }

`
export const COMPLETED_TODO = gql`
    mutation updateTodoCompleted($todoId :String!, $completed: Boolean!) {
        update_todos_by_pk(pk_columns: {id: $todoId}, _set: {is_completed: $completed}){
            id
            user_id
            title
            description
            created_at
            is_completed
        }
    }
`

export const DELETE_TODOS_BY_TODO_ID = gql`
    mutation deleteTodo($todoId : String!){
        delete_todos_by_pk(id :$todoId){
            id
            user_id
            title
            description
            created_at
        }
    }
`

export const DELETE_COMPLETED_TODOS = gql`
    mutation deleteCompletedTodo {
    delete_todos(where: {is_completed: {_eq:true}}){
        affected_rows
    }
}
`

export const DELETE_ALL_TODOS = gql`
    mutation{
        delete_todos(where:{}){
            affected_rows
        }
    }
`


export const TODOS_OF_A_USER = gql`
   query GetTodosOfUser($id:String!){
  users_by_pk(id: $id){
    id
    name
    created_at
      todos {
        id
        user_id
        created_at
        title
        description
        is_completed
      }
    }
  }
`

