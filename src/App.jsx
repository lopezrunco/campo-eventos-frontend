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
import LiveEventById from "./pages/LiveEventById";
import { Servicios } from "./pages/Servicios";
import EventsList from "./pages/events/EventsList";
import LotById from "./pages/events/LotById";
import PreOfferDone from "./pages/events/PreOfferDone";
import MyPreOffers from "./pages/events/MyPreOffers";

import Login from "./pages/security/Login";
import Register from "./pages/security/Register";
import { NotFound } from "./pages/access/NotFound";
import UpdateUserInfo from "./pages/security/UpdateUserInfo";
import UserUpdated from "./pages/security/UserUpdated";
import { Forbidden } from "./pages/access/Forbidden";

import ConsigneesHomePage from "./pages/consignees/ConsigneesHomePage";
import MyEvents from "./pages/consignees/MyEvents";
import MyEventById from "./pages/consignees/MyEventById";
import PreOfferEdited from "./pages/consignees/PreOfferEdited";
import CreateEvent from "./pages/consignees/CreateEvent";
import EventCreated from "./pages/consignees/EventCreated";
import EventDeleted from "./pages/consignees/EventDeleted";
import PreofferDeleted from "./pages/consignees/PreofferDeleted";
import CreateLot from "./pages/consignees/CreateLot";
import LotCreated from "./pages/consignees/LotCreated";
import LotEdited from "./pages/consignees/LotEdited";
import LotDeleted from "./pages/consignees/LotDeleted";
import UploadEventCover from "./pages/consignees/UploadEventCover";
import AddVideoToLot from "./pages/consignees/AddVideoToLot";
import UpdateEvent from "./pages/consignees/UpdateEvent";
import UpdateLot from "./pages/consignees/UpdateLot";

import { BackOfficeHome } from "./pages/backoffice/BackOfficeHome";
import CreateLiveEvent from "./pages/backoffice/CreateLiveEvent";
import LiveEventCreated from "./pages/backoffice/LiveEventCreated";
import LiveEventDeleted from "./pages/backoffice/LiveEventDeleted";
import LiveEvents from "./pages/backoffice/LiveEvents";
import UploadLiveEventCover from "./pages/backoffice/UploadLiveEventCover";
import UpdateLiveEvent from "./pages/backoffice/UpdateLiveEvent";
import UserList from "./pages/backoffice/UserList";

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
  id: localStorage.getItem("id"),
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
      localStorage.setItem("id", action.payload.user.id);
      localStorage.setItem("refreshToken", action.payload.user.refreshToken);

      // Return new state
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

    case LOGOUT:
      localStorage.clear();

      // Return new state with reseted values
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        role: null,
        token: null,
        id: null,
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
              path="/admin/remates-vivo/editar/:id"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <UpdateLiveEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/remates-vivo/:id/upload"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <UploadLiveEventCover />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/remate-vivo-borrado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <LiveEventDeleted />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/remate-vivo-creado"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <LiveEventCreated />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/crear-remate-vivo"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <CreateLiveEvent />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/remates-vivo"
              element={
                <RequireAuth allowedRoles={["ADMIN"]}>
                  <LiveEvents />
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
              path="/consignatarios"
              element={
                <RequireAuth allowedRoles={["ADMIN", "CONS"]}>
                  <ConsigneesHomePage />
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
              path="/preoffer-done"
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
              path="/remates"
              element={
                <RequireAuth allowedRoles={["BASIC", "ADMIN", "CONS"]}>
                  <EventsList />
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
            <Route
              path="/forbidden"
              element={
                <>
                  <Forbidden />
                </>
              }
            />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/remates-vivo/:id" element={<LiveEventById />} />
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

// Cambios prioritarios:
// TO DO: Poner fecha a todos los remates y poner los mas nuevos primero
// TO DO: Ver problema de _id entre recien registrados y logueados
// TO DO: Chequear paginacion en todos los listados de entidades
// TO DO: Que las preofertas se muestren directamente
// TO DO: Sacar campo de moneda, que sea todo dolares
// TO DO: El boton de "Ver lotes" que diga "Ver lotes y preofertar". En el lot card que el boton "Ver lote" sea "Detalles y ofertar". Tambien que se muestre el nombre del lote, la miniatura del video, categoria, cantidad y nombre (en el caso de caballo), ubicacion (porque dependiendo del lote puede variar la ubicacion) y la ultima preoferta aceptada (opcional, si no hay preofertas que lo diga)
// TO DO: En Mis preofertas, que se muestre de una el Titulo del Remate y el Nombre del lote con miniatura del video y lo que ya esta (Monto, si esta aceptado y Link al lote)
// TO DO: En cosignatarios - mis remates que el desplegable se elimine, que se muestren los lotes de una y que el boton de "Subir lote"
// TO DO: En cosignatarios - mis remates - lotes que los desplegables de ver lote y ver preofertas se muestren de una
// TO DO: En la parte de consignatarios en vez de "Crear lote" que sea "Subir lote"

// TO DO: Cuando se crea el remate que de la opcion de Tipo de remate: Equinos, Bovinos, Ovinos y Remate por pantalla. Dependiendo del tipo de remate es el formulario que se mostrara al consignatario y la info que se mostrara al usuario.
// Actualizacion instruccion nestor 1 jul: Los campos que actualmente hay en los formularios de creacion de remate que sean solo para Remates por pantalla. Los datos siguientes que sean para los demas Remates(ovinos, bovinos, equinos): "Nombre: / R.P.: / Categoría: / Peso: / Fecha de nacimiento: / Pedigree: / Cabaña: / Otro dato:""

// -------------------------------------------------------------------

// Cambios secundarios:
// TO DO: Poner mensaje de Wait cuando esta subiendo el video o img y deshabilitar el boton
// TO DO: Terminar codigo de cleaningTextareas para evitar errores al hacer break lines
// TO DO: Solucionar warning de missing props validation
// TO DO: En la seccion home- en vivo, manejar error cuando Nestor no agrega enlace al rematevivo y llega la fecha de emision
// TO DO: Sacar campo de token
// TO DO: Area de los botones solo es clickeable el texto pero no el padding
// TO DO: Chequear manejo de errores en los formularios
// TO DO: Agregar "Categoria: " en la etiqueta de categoria
// TO DO: Chequear los textos de los mensajes de exito al terminar una accion
// TO DO: Tratar de que al crear remate en vivo se pueda subir imagen en el mismo lugar
// TO DO: Al terminar todo, ajustar UI en celulares
// TO DO: Que las cajas sean clickeables en su totalidad, no solo los botones de "Ver más"
// TO DO: Chequear validaciones de usuarios tanto en front como backend
// TO DO: Que el usuario pueda subir foto de perfil o por defecto mostrar una imagen generica
// TO DO: Arreglar los meta count en los endpoints y mostrarlos segun el caso
// TO DO: Reforzar seguridad
// TO DO: Testing