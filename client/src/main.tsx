import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { SearchProvider } from "./context/SearchContext";
import { SearchDialogContainer } from "./components/search/SearchDialogContainer";

createRoot(document.getElementById("root")!).render(
  <SearchProvider>
    <App />
    <SearchDialogContainer />
  </SearchProvider>
);
