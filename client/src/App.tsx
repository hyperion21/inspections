import { BrowserRouter } from "react-router-dom";
import AppRoutesComponent from "./Routes";
import "./app.css";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutesComponent />
    </BrowserRouter>
  );
};

export default App;
