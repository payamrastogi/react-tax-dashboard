import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

const PrivateRoute = (props) => {
  const { children } = props;
  const { isLoggedIn, user, login } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoggedIn) {
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      login(JSON.parse(localStorageUser));
    } else {
      return (
        <Navigate
          replace={true}
          to="/login"
          state={{ from: `${location.pathname}${location.search}` }}
        />
      );
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
