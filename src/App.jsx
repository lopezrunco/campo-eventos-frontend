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

import { Servicios } from "./pages/Servicios";
import EventsList from "./pages/events/EventsList";
import EventById from "./pages/events/EventById";
import LotById from "./pages/events/LotById";
import PreOfferDone from "./pages/events/PreOfferDone";
import MyPreOffers from "./pages/events/MyPreOffers";

import Login from "./pages/security/Login";
import Register from "./pages/security/Register";
import UserCreated from "./pages/security/UserCreated";
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
import EventUpdated from "./pages/consignees/EventUpdated";
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
import UserList from "./pages/backoffice/UserList";
import AllEvents from "./pages/backoffice/AllEvents";

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

// Reducer to manage login type actions
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
            {/* <Route path="/register" element={<Register />} /> */}
            <Route path="/user-created" element={<UserCreated />} />
            <Route path="/remates/:id" element={<EventById />} />
            <Route path="/" element={<EventsList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>

          <Footer />

        {state.showingLoader && <Loader />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

// TO DO:

// Octubre:
// Cargar imagen evento en la misma pantalla de remate

// Problema de paginacion: remates viejos que no se muestran igual siguen ocupando lugar en la paginacion y entonces los remates pendientes saltan a la siguiente pagina
// - Separar entre preofertas de remates que existen y preofertas de remates terminados o eliminados. Que las no activas puedan ser elimiadas por el usuario. 
// - en Crear lote, agregar campo "cabaña"
// - Se eliminaron las validaciones en el backend, habilitarlas para contemplar caracteres espciales y que la validacion tambien se aplique en el update.
// - Reemplazar Bootstrap y fontawesome por bibliotecas locales?
// - Revisar campos obligatorios en todos los formularios y mensajes de error en formularios
// - Solucionar problema de _id & id para que el usuario no inicie sesion despues de registrarse
// - Mis remates que tenga colores mas oscuros tipo administrador
// - Que se cargue el afiche desde el formulario de creacion de remate o de inmediato
// - Averiguar como dar opcion a recuperar contraseña
// - Arreglar que cuando se elimina el remate la preoferta queda colgada. 
// - Que se permita al usuario editar sus datos de contacto
// - En formularios de edicion cuando no hay link que muestre algo diferente a undefined
// - Generar bitacora descargable con los datos de remates, lotes, preofertas y clientes. 
// - Que al eliminar el remate se eliminen tamb los lotes y las preofertas
// - Que el enlace final del remate sea amigable con el usuario
// - Dar posiblidad de agregar la hoja del catalogo (o catalogo completo), en vez de completar los datos (tanto link a pdf ya subido como que lo suban de la pc)
// - Que despues de Lote editado y lote eliminado lleve al remate
// - ver problemas de estilos z-index en tags e icono de video
// - Terminar codigo de cleaningTextareas para evitar errores al hacer break lines
// - En la seccion home - en vivo, manejar error cuando Nestor no agrega enlace al rematevivo y llega la fecha de emision
// - Chequear manejo de errores en los formularios
// - Chequear validaciones de usuarios tanto en front como backend
// - Que el usuario pueda subir foto de perfil o por defecto mostrar una imagen generica
// - Arreglar los meta count en los endpoints y mostrarlos segun el caso
// - Ajustar estilos Desktop y celulares (Redondear todas las imagenes & iframes)
// - Reforzar seguridad
// - Testing
// - Notificaciones a usuarios mediante email, sms o wapp
// - Que se permitan espacios en registro de numero tel
// - En listado de remates, al pasar a siguiente que devuelva al top
// - Chequear las redirecciones de emnsajes de confirmacion. Porque a veces tanto como Consignatario como Admin usan las mismas pantallas-
// - Manejar cuando el remate esta completado
// - Que boton de siguiente no se muestre cuando no hay mas paginas
// - Mejorar mensajes de Exito, editado, borrado, llevando a URL del elemento afectado
// - Uniformizar fade effect 
// - Reducir codigo repetido
// - Implementar sistema de tokens solo para usuarios administradores
// - Arreglar pestañeo de 404 cuando cambia de pagina
// - Averiguar correos corporativos en google
// - Ver como funciona este sistema y replicar preoferta por animales dentro del lote: https://juanvera.preofertas.uy/lotes/lotespublicados/remate/21
