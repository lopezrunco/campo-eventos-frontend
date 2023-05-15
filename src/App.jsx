import { Routes, Route, BrowserRouter } from "react-router-dom";
import { createContext, useReducer } from "react";
import { HIDE_LOADER, SHOW_LOADER } from "./utils/general-action-types";
import { NotFound } from "./pages/NotFound";
import { Home } from "./pages/Home";
import { Servicios } from "./pages/Servicios";
import { ScrollOnNav } from './components/ScrollOnNav'
import { Loader } from "./components/Loader";
import "./App.scss";

export const GeneralContext = createContext();

const initialState = {
  showingLoader: false,
};

const reducer = (state, action) => {
  switch (action.type) {
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

  return (
    <GeneralContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <BrowserRouter>
        <ScrollOnNav />
          <Routes>
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {state.showingLoader && <Loader />}
      </div>
    </GeneralContext.Provider>
  );
}

export default App;
