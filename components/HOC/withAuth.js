import {useRouter} from 'next/router'
import { useEffect } from 'react';

const withAuth = (WrappedComponent) => {


  return (props) => {
    if (typeof window !== "undefined") {
      const Router = useRouter();

      const accessToken = sessionStorage.getItem("token");


      
      useEffect(() => {
        if (!accessToken) {
        Router.replace("/login");
        return null;
      }
      }, [accessToken])


      return <WrappedComponent {...props} />;
    }
      return null;
      
  };
};

export default withAuth;