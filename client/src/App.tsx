import { useEffect, useState } from "react";
import { useUser } from "./context";
import { AppRoutes } from "./services/routes";
import { appStorage } from "./services/appStorage";
import { loginByToken } from "./features/auth/api";
import { Box, CircularProgress } from "@mui/material";

function App() {
  const { handleUser } = useUser();
  
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  
  useEffect(() => {
    const token = appStorage.getToken();

    const executeLoginByToken = async () => {
      try {
        if (!token) return;
        setIsFetchingUser(true);
        const user = await loginByToken();

        if (user) {
          handleUser(user);
          appStorage.setToken(user.token);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetchingUser(false);
      }
    };
    executeLoginByToken();
  }, [handleUser]);

  if (isFetchingUser) {
    return (
      <Box sx={{ height: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  return <AppRoutes />;
}

export default App;
