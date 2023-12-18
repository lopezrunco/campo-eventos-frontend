import { motion } from "framer-motion";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createContext, useEffect, useReducer } from "react";

import {
  // ENABLE_MFA,
  HIDE_LOADER,
  LOGIN,
  LOGGING_OUT,
  LOGOUT,
  REFRESH_TOKEN,
  SHOW_LOADER,
} from "./utils/action-types";

import { Home } from "./pages/Home";
import { Servicios } from "./pages/Servicios";
import EventsList from "./pages/events/EventsList";
import EventById from "./pages/events/EventById";
import LotById from "./pages/events/LotById";
import PreOfferDone from "./pages/events/PreOfferDone";
import MyPreOffers from "./pages/events/MyPreOffers";

import Login from "./pages/security/Login";
// import Register from "./pages/security/Register";
import UserCreated from "./pages/security/UserCreated";
import { NotFound } from "./pages/access/NotFound";
import UpdateUserInfo from "./pages/security/UpdateUserInfo";
import UserUpdated from "./pages/security/UserUpdated";
import { Forbidden } from "./pages/access/Forbidden";

import MyEvents from "./pages/cons-backoffice/MyEvents";
import MyEventById from "./pages/cons-backoffice/MyEventById";
import PreOfferEdited from "./pages/cons-backoffice/PreOfferEdited";
import CreateEvent from "./pages/cons-backoffice/CreateEvent";
import EventCreated from "./pages/cons-backoffice/EventCreated";
import EventUpdated from "./pages/cons-backoffice/EventUpdated";
import EventDeleted from "./pages/cons-backoffice/EventDeleted";
import PreofferDeleted from "./pages/cons-backoffice/PreofferDeleted";
import CreateLot from "./pages/cons-backoffice/CreateLot";
import LotCreated from "./pages/cons-backoffice/LotCreated";
import LotEdited from "./pages/cons-backoffice/LotEdited";
import LotDeleted from "./pages/cons-backoffice/LotDeleted";
import UploadEventCover from "./pages/cons-backoffice/UploadEventCover";
import AddVideoToLot from "./pages/cons-backoffice/AddVideoToLot";
import UpdateEvent from "./pages/cons-backoffice/UpdateEvent";
import UpdateLot from "./pages/cons-backoffice/UpdateLot";
import { AllPosts } from "./pages/admin-backoffice/AllPosts";

import { CreatePost } from "./pages/author-backoffice/CreatePost";
import { UpdatePost } from "./pages/author-backoffice/UpdatePost";
import PostCreated from "./pages/author-backoffice/PostCreated";
import PostUpdated from "./pages/author-backoffice/PostUpdated";
import PostDeleted from "./pages/author-backoffice/PostDeleted";
import { MyPosts } from "./pages/author-backoffice/MyPosts";
import { MyPostById } from "./pages/author-backoffice/MyPostById";
import { PostById } from "./pages/blog/PostById";
import { PostsByTag } from "./pages/blog/PostsByTag";

import { BackOfficeHome } from "./pages/admin-backoffice/BackOfficeHome";
import UserList from "./pages/admin-backoffice/UserList";
import AllEvents from "./pages/admin-backoffice/AllEvents";

import RequireAuth from "./components/RequireAuth";
import { ScrollOnNav } from "./components/ScrollOnNav";
import { Loader } from "./components/Loader";
import { Top } from "./components/Top";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollTop } from "./components/ScrollTop";

import "./App.scss";

// Create context to manage authentication data type
export const AuthContext = createContext();

// Initial state of auth context
const initialState = {
  isAuthenticated: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")),
  role: localStorage.getItem("role"),
  token: localStorage.getItem("token"),
  id: localStorage.getItem("id"),
  refreshToken: localStorage.getItem("refreshToken"),
  showingLoader: false,
};

// Reducer to manage login type actions
const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      // Set user data in local storage
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("role", action.payload.user.role);
      localStorage.setItem("token", action.payload.user.token);
      localStorage.setItem("id", action.payload.user.id);
      localStorage.setItem("refreshToken", action.payload.user.refreshToken);

      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        role: action.payload.user.role,
        token: action.payload.user.token,
        id: action.payload.user.id,
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

    case LOGGING_OUT:
      localStorage.clear();

      return {
        ...state,
        showingLoader: true,
      };

    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null,
        token: null,
        id: null,
        refreshToken: null,
        showingLoader: false,
      };

    // case ENABLE_MFA:
    //   // Basically, clones actual user and enables MFA
    //   const user = {
    //     ...state.user,
    //     mfaEnabled: true,
    //   };

    //   // Save in local storage to disable MFA enable button
    //   localStorage.setItem("user", JSON.stringify(user));

    //   return {
    //     ...state,
    //     user,
    //   };

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
              path="/consignatarios/mis-remates/lotes/editar/:id"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <UpdateLot />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/editar/:id"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <UpdateEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/usuarios"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <UserList />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/remates"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AllEvents />
                </RequireAuth>
              }
            />
            <Route
              path="/admin"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <BackOfficeHome />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/lotes/:id/upload"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <AddVideoToLot />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/:id/upload"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <UploadEventCover />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/preoferta-borrada"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <PreofferDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/remate-borrado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <EventDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/lote-borrado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <LotDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/:id/lote-editado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <LotEdited />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/:id/lote-creado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <LotCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/:id/crear-lote"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <CreateLot />
                </RequireAuth>
              }
            />
            <Route
              path="/remate-editado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <EventUpdated />
                </RequireAuth>
              }
            />
            <Route
              path="/remate-creado"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <EventCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/crear-remate"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <CreateEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/preoferta-editada"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <PreOfferEdited />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates/:id"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <MyEventById />
                </RequireAuth>
              }
            />
            <Route
              path="/consignatarios/mis-remates"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <MyEvents />
                </RequireAuth>
              }
            />
            <Route
              path="/mis-preofertas"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <MyPreOffers />
                </RequireAuth>
              }
            />
            <Route
              path="/preoferta-hecha"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <PreOfferDone />
                </RequireAuth>
              }
            />
            <Route
              path="/lotes/:id"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <LotById />
                </RequireAuth>
              }
            />
            <Route
              path="/usuario-actualizado"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <UserUpdated />
                </RequireAuth>
              }
            />
            <Route
              path="/actualizar-usuario"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <UpdateUserInfo />
                </RequireAuth>
              }
            />

            {/* Blog routes ------------------------------------------------ */}

            <Route path="/articulos/etiqueta/:tag" element={<PostsByTag />} />
            <Route path="/articulos/:id" element={<PostById />} />

            <Route
              path="/admin/articulos"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <AllPosts />
                </RequireAuth>
              }
            />

            <Route
              path="/autor/articulos/mis-articulos/:id"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <MyPostById />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/mis-articulos"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <MyPosts />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/articulo-borrado"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <PostDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/articulo-editado"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <PostUpdated />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/articulo-creado"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <PostCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/mis-articulos/editar/:id"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <UpdatePost />
                </RequireAuth>
              }
            />
            <Route
              path="/autor/articulos/crear"
              element={
                <RequireAuth allowedRoles={["AUTHOR", "ADMIN"]}>
                  <CreatePost />
                </RequireAuth>
              }
            />

            <Route path="/forbidden" element={<Forbidden />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/login" element={<Login />} />
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/user-created" element={<UserCreated />} />
            <Route path="/remates/:id" element={<EventById />} />
            <Route path="/cartelera" element={<EventsList />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

        <Footer />
        <ScrollTop scrollTo={"#top"} />

        {state.showingLoader && <Loader />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
