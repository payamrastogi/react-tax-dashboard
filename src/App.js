import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Customers from "./scenes/customers";
import Contacts from "./scenes/contacts";
import Form from "./scenes/form/customer";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginForm from "./scenes/global/LoginForm";
import PrivateRoute from "./scenes/global/PrivateRoute";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation();

  // Function to check if the current location matches certain paths
  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !["/login", "/signup"].includes(pathname);
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {shouldShowSidebar() && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {shouldShowSidebar() && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/login" element={<LoginForm />} />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute>
                    <Customers />
                  </PrivateRoute>
                }
              />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/form" element={<Form />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
