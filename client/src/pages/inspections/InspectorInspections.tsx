import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import { useAuth } from "../../context/AuthContext";
import type { Inspection } from "../../types/inspection";
import InspectionStatusTag from "./inspectionStatusTag/InspectionStatusTag";

const InspectorInspections = () => {
  const { token } = useAuth();
  const [inspections, setInspections] = useState<Inspection[]>([]);

  const fetchInspections = async () => {
    if (!token) return;

    const data = await baseFetch("/inspections/assigned", {}, token);

    setInspections(data);
  };

  useEffect(() => {
    void fetchInspections();
  }, [token]);

  const handleStart = async (id: number) => {
    await baseFetch(`/inspections/${id}/start`, { method: "POST" }, token!);
    await fetchInspections();
  };

  const handleComplete = async (id: number) => {
    console.log("Open complete modal", id);
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Inspection ID</th>
          <th>Location</th>
          <th>Status</th>
          <th>Planned Start</th>
          <th>Actual Start</th>
          <th>Result</th>
          <th>Comments</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {inspections.map((insp) => (
          <tr key={insp.id}>
            <td>{insp.id}</td>
            <td>{insp.location?.name}</td>
            <td>
              <InspectionStatusTag status={insp.status} />
            </td>
            <td>
              {insp.startDateTime
                ? new Date(insp.startDateTime).toLocaleString()
                : "-"}
            </td>
            <td>
              {insp.actualStartDateTime
                ? new Date(insp.actualStartDateTime).toLocaleString()
                : "-"}
            </td>
            <td>{insp.result ?? "-"}</td>
            <td>{insp.comments ?? "-"}</td>
            <td>
              {insp.status === "YET_TO_START" && (
                <Button size="sm" onClick={() => handleStart(insp.id)}>
                  Start
                </Button>
              )}

              {insp.status === "IN_PROGRESS" && (
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => handleComplete(insp.id)}
                >
                  Complete
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default InspectorInspections;
