import {useRouter} from 'next/router'

function withAuth(WrappedComponent){
  return function AuthGuard(props){
    const Router = useRouter();     
      if (typeof window === "undefined") return null;

      const accessToken = sessionStorage.getItem("token");
      
      if (!accessToken) {
        Router.replace("/login");
        return null;
      }

      return <WrappedComponent {...props}/>;
    }
};

export default withAuth;