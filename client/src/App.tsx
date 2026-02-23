import { BrowserRouter } from "react-router-dom";
import AppRoutesComponent from "./Routes";

const App = () => {
  return (
    <BrowserRouter>
      <AppRoutesComponent />
    </BrowserRouter>
  );
};

export default App;
