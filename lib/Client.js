import { useState } from "react";

import {
  ApolloClient,
  InMemoryCache,
} from "@apollo/client";


const createClient = () => {
    return new ApolloClient({
        uri: process.env.NEXT_PUBLIC_API_HOST,
        cache: new InMemoryCache(),
    });
}

export const client = createClient();
