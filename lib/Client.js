import { useState } from "react";

import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";


const createClient = () => {
    return new ApolloClient({
        uri: "https://next-realtime-todo.hasura.app/v1/graphql",
        cache: new InMemoryCache(),
    });
}


export const client = createClient();