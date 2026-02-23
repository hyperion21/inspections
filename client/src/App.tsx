import { BrowserRouter } from "react-router-dom";
import "./app.css";
import AppRoutesComponent from "./routes/Routes";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutesComponent />
    </BrowserRouter>
  );
};

export default App;
