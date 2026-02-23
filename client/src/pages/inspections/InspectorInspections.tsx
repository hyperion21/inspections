import { useEffect, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { baseFetch } from "../../api/baseFetch";
import { useAuth } from "../../context/AuthContext";
import type { Inspection } from "../../types/inspection";
import InspectionStatusTag from "./inspectionStatusTag/InspectionStatusTag";

const InspectorInspections = () => {
  const { token } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchInspections = async () => {
    if (!token) return;
    setLoading(true);
    const data = await baseFetch("/inspections/assigned", {}, token);
    setInspections(data);
    setLoading(false);
  };

  useEffect(() => {
    void fetchInspections();
  }, [token]);

  const calculateDuration = (insp: Inspection) => {
    if (!insp.actualStartDateTime || !insp.endDateTime) return "-";
    const start = new Date(insp.actualStartDateTime);
    const end = new Date(insp.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <Row className="g-3">
      {inspections.map((insp) => (
        <Col key={insp.id} xs={12} sm={12} md={4}>
          <Card
            style={{
              height: "200px",
              cursor: "pointer",
              opacity: insp.status === "COMPLETED" ? 0.7 : 1,
            }}
            onClick={() => navigate(`/inspections/${insp.id}`)}
          >
            <Card.Body>
              <Card.Title>Inspection #{insp.id}</Card.Title>
              <Card.Subtitle className="mb-2">
                <InspectionStatusTag status={insp.status} />
              </Card.Subtitle>
              <Card.Text>
                Start Date:{" "}
                {new Date(
                  insp.actualStartDateTime ?? insp.startDateTime ?? "-",
                ).toLocaleString()}
              </Card.Text>
              {(insp.status === "IN_PROGRESS" ||
                insp.status === "COMPLETED") && (
                <Card.Text>Duration: {calculateDuration(insp)}</Card.Text>
              )}
              {insp.status === "COMPLETED" && (
                <Card.Text>Result: {insp.result}</Card.Text>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default InspectorInspections;
