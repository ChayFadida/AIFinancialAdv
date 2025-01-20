import { useEffect } from "react";
import { useUser } from "./context";
import { AppRoutes } from "./services/routes";
import { appStorage } from "./services/appStorage";
import { loginByToken } from "./features/auth/api";
// import { loginByToken } from "./features/api";

function App() {
  const { handleUser } = useUser();

  useEffect(() => {
    const token = appStorage.getToken();

    const executeLoginByToken = async () => {
      try {
        if (!token) return;

        const user = await loginByToken();

        if (user) {
          handleUser(user);
          appStorage.setToken(user.token);
        }
      } catch (error) {
        console.error(error);
      }
    };
    executeLoginByToken();
  }, [handleUser]);

  return <AppRoutes />;
}

export default App;
