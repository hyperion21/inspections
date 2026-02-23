import { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { baseFetch } from "../../../api/baseFetch";
import TopNavbar from "../../../components/topNavbar/TopNavbar";
import { useAuth } from "../../../context/AuthContext";
import type { Inspection } from "../../../types/inspection";
import InspectionStatusTag from "../inspectionStatusTag/InspectionStatusTag";

const InspectionDetailPage = () => {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<"PASS" | "FAIL">("PASS");
  const [comments, setComments] = useState("");

  const fetchInspection = async () => {
    if (!token || !id) return;
    setLoading(true);
    const data = await baseFetch(`/inspections/${id}`, {}, token);
    setInspection(data);
    setResult(data.result ?? "PASS");
    setComments(data.comments ?? "");
    setLoading(false);
  };

  useEffect(() => {
    void fetchInspection();
  }, [id, token]);

  const handleStart = async () => {
    if (!token || !inspection) return;
    await baseFetch(
      `/inspections/${inspection.id}/start`,
      { method: "POST" },
      token,
    );
    await fetchInspection();
  };

  const handleComplete = async () => {
    if (!token || !inspection) return;
    await baseFetch(
      `/inspections/${inspection.id}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ result, comments }),
      },
      token,
    );
    await fetchInspection();
  };

  const calculateDuration = () => {
    if (!inspection?.actualStartDateTime || !inspection?.endDateTime)
      return "-";
    const start = new Date(inspection.actualStartDateTime);
    const end = new Date(inspection.endDateTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (loading || !inspection) return <Spinner animation="border" />;

  return (
    <>
      <TopNavbar />

      <Container className="p-4 d-flex flex-column min-vh-100">
        <h3>Inspection #{inspection.id}</h3>
        <hr className="mb-4" />
        <p>
          Status: <InspectionStatusTag status={inspection.status} />
        </p>
        <p>
          Planned Start:{" "}
          {inspection.startDateTime
            ? new Date(inspection.startDateTime).toLocaleString()
            : "-"}
        </p>

        {inspection.status !== "YET_TO_START" && (
          <>
            <p>
              Actual Start:{" "}
              {inspection.actualStartDateTime
                ? new Date(inspection.actualStartDateTime).toLocaleString()
                : "-"}
            </p>
          </>
        )}

        {inspection.status === "COMPLETED" && (
          <>
            <p>
              End:{" "}
              {inspection.endDateTime
                ? new Date(inspection.endDateTime).toLocaleString()
                : "-"}
            </p>
            <p>Duration: {calculateDuration()}</p>
            <p>Result: {inspection.result}</p>
            <p>Comments: {inspection.comments || "-"}</p>
          </>
        )}

        {inspection.status === "YET_TO_START" && (
          <div className="d-flex mt-3">
            <Button className="ms-auto default-button" onClick={handleStart}>
              Start
            </Button>
          </div>
        )}

        {inspection.status === "IN_PROGRESS" && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Result</Form.Label>
              <div>
                <Button
                  variant={result === "PASS" ? "success" : "outline-secondary"}
                  className="me-2"
                  onClick={() => setResult("PASS")}
                >
                  PASS
                </Button>
                <Button
                  variant={result === "FAIL" ? "danger" : "outline-secondary"}
                  onClick={() => setResult("FAIL")}
                >
                  FAIL
                </Button>
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex mt-3">
              <Button
                className="ms-auto default-button"
                variant="success"
                onClick={handleComplete}
              >
                Complete
              </Button>
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default InspectionDetailPage;
