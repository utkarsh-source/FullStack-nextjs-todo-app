import {useRouter} from 'next/router'
import { useEffect } from 'react';

function withAuth(WrappedComponent){

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

      return <WrappedComponent {...props} name="Wrapped Component" />;
    }
      return null;
      
  };
};

export default withAuth;