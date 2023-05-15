import { motion } from "framer-motion";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createContext, useEffect, useReducer } from "react";

import {
  ENABLE_MFA,
  HIDE_LOADER,
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN,
  SHOW_LOADER,
} from "./utils/action-types";

import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Servicios } from "./pages/Servicios";
import Login from "./pages/security/Login";
import Register from "./pages/security/Register";

import { ScrollOnNav } from "./components/ScrollOnNav";
import { Loader } from "./components/Loader";
import { Top } from "./components/Top";
import { Footer } from "./components/Footer";

import "./App.scss";

// Create context to manage authentication data type
export const AuthContext = createContext();

// Initial state of auth context
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  showingLoader: false,
};

// Reducer to manage actions of login type
const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      // Take user data and set it in local storage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.user.token);
      localStorage.setItem("refreshToken", action.payload.user.refreshToken);

      // Return new state
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.user.token,
        refreshToken: action.payload.user.refreshToken,
      };

    case REFRESH_TOKEN:
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("refreshToken", action.payload.refreshToken);

      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };

    case LOGOUT:
      localStorage.clear();

      // Return new state with reseted values
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
      };

    case ENABLE_MFA:
      // Basically, clones actual user and enables MFA
      const user = {
        ...state.user,
        mfaEnabled: true,
      };

      // Save in local storage to disable MFA enable button
      localStorage.setItem("user", JSON.stringify(user));

      return {
        ...state,
        user,
      };

    case SHOW_LOADER:
      return {
        ...state,
        showingLoader: true,
      };

    case HIDE_LOADER:
      return {
        ...state,
        showingLoader: false,
      };

    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // Try to obtain the user data from the local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // If the user is already logged, do a login dispatch with the data
    if (user && token) {
      dispatch({
        type: LOGIN,
        payload: {
          user,
          token,
        },
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <BrowserRouter>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Top />
          </motion.div>
          <ScrollOnNav />
          <Routes>
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <Footer />
        </motion.div>

        {state.showingLoader && <Loader />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
