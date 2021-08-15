import { ApolloProvider } from '@apollo/client'
import AppContext, { Context } from '../AppContext'
import { client } from '../lib/Client'
import { useContext } from 'react'
import '../styles/globals.css'
import 'react-toastify/dist/ReactToastify.css';


function MyApp({ Component, pageProps }) {
 
  return <AppContext><ApolloProvider client={client}><Component {...pageProps} /></ApolloProvider></AppContext>
}

export default MyApp
