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

import { Home } from "./pages/Home";
import PublicEventsList from "./pages/PublicEventsList";
import { Servicios } from "./pages/Servicios";
import EventsList from "./pages/events/EventsList";
import LotById from "./pages/events/LotById";
import PreOfferDone from "./pages/events/PreOfferDone";
import MyPreOffers from "./pages/events/MyPreOffers";

import Login from "./pages/security/Login";
import Register from "./pages/security/Register";
import { NotFound } from "./pages/access/NotFound";
import { Forbidden } from "./pages/access/Forbidden";

import AdminHomePage from "./pages/backoffice/AdminHomePage";
import MyEvents from "./pages/backoffice/MyEvents";
import MyEventById from "./pages/backoffice/MyEventById";
import PreOfferEdited from "./pages/backoffice/PreOfferEdited";
import CreateEvent from "./pages/backoffice/CreateEvent";
import EventCreated from "./pages/backoffice/EventCreated";
import EventDeleted from "./pages/backoffice/EventDeleted";
import PreofferDeleted from "./pages/backoffice/PreofferDeleted";
import CreateLot from "./pages/backoffice/CreateLot";
import LotCreated from "./pages/backoffice/LotCreated";
import LotDeleted from "./pages/backoffice/LotDeleted";
import UploadImage from "./pages/backoffice/UploadImage";
import UploadVideo from "./pages/backoffice/UploadVideo";

import RequireAuth from "./components/RequireAuth";
import { ScrollOnNav } from "./components/ScrollOnNav";
import { Loader } from "./components/Loader";
import { Top } from "./components/Top";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

import "./App.scss";

// Create context to manage authentication data type
export const AuthContext = createContext();

// Initial state of auth context
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  role: localStorage.getItem("role"),
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
      localStorage.setItem("role", action.payload.user.role);
      localStorage.setItem("token", action.payload.user.token);
      localStorage.setItem("refreshToken", action.payload.user.refreshToken);

      // Return new state
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.user.role,
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
        role: null,
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
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    // If the user is already logged, do a login dispatch with the data
    if (user && token) {
      dispatch({
        type: LOGIN,
        payload: {
          user,
          role,
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <Header />
          </motion.div>
          <ScrollOnNav />
          <Routes>
            <Route
              path="/consignatarios/mis-eventos/lotes/:id/upload"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <UploadVideo />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/:id/upload"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <UploadImage />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/preoferta-borrada"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <PreofferDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/evento-borrado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <EventDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/lote-borrado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <LotDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/:id/lote-creado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <LotCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/:id/crear-lote"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <CreateLot />
                </RequireAuth>
              }
            />
            <Route
              path="/remate-creado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <EventCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/crear-remate"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <CreateEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/preoferta-editada"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <PreOfferEdited />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos/:id"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <MyEventById />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-eventos"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <MyEvents />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AdminHomePage />
                </RequireAuth>
              }
            />
            <Route
              path="/mis-preofertas"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN"]}>
                  <MyPreOffers />
                </RequireAuth>
              }
            />
            <Route
              path="/preoffer-done"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN"]}>
                  <PreOfferDone />
                </RequireAuth>
              }
            />
            <Route
              path="/lotes/:id"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN"]}>
                  <LotById />
                </RequireAuth>
              }
            />
            <Route
              path="/remates"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN"]}>
                  <EventsList />
                </RequireAuth>
              }
            />
            <Route
              path="/forbidden"
              element={
                <>
                  <Forbidden />
                </>
              }
            />
            <Route path="/cartelera" element={<PublicEventsList />} />
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
