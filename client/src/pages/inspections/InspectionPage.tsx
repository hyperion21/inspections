import { Container } from "react-bootstrap";
import TopNavbar from "../../components/topNavbar/TopNavbar";
import { useAuth } from "../../context/AuthContext";
import InspectorInspections from "./InspectorInspections";
import ManagerInspections from "./ManagerInspections";

const InspectionsPage = () => {
  const { user } = useAuth();

  const renderContent = () => {
    if (user?.role === "MANAGER") {
      return <ManagerInspections />;
    }

    if (user?.role === "INSPECTOR") {
      return <InspectorInspections />;
    }

    return null;
  };

  return (
    <>
      <TopNavbar />
      <Container className="p-4">
        <h3>{user?.role === "MANAGER" ? "Inspections" : "My Inspections"}</h3>
        <hr />
        {renderContent()}
      </Container>
    </>
  );
};

export default InspectionsPage;
