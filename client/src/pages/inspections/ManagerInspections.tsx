import { useEffect, useState } from "react";
import { Button, Col, Row, Table } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import type { Inspection } from "../../types/inspection";
import AssignInspectorModal from "./AssignInspectorModal";
import NewInspectionModal from "./NewInspectionModal";
import InspectionStatusTag from "./inspectionStatusTag/InspectionStatusTag";

const ManagerInspections = () => {
  const { token } = useAuth();
  const { showToast } = useToast();
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState<
    number | null
  >(null);
  const [selectedInspectionStart, setSelectedInspectionStart] = useState<
    string | null
  >(null);
  const [selectedAssignedInspectorId, setSelectedAssignedInspectorId] =
    useState<string | null>(null);

  const fetchInspections = async () => {
    if (!token) return;
    try {
      const data = await baseFetch("/inspections", {}, token);
      setInspections(data);
    } catch (err: any) {
      showToast(err.message || "Failed to fetch inspections", "danger");
    }
  };

  useEffect(() => {
    void fetchInspections();
  }, [token]);

  const calculateDuration = (start: string | null, end: string | null) => {
    if (!start || !end) return "-";
    const diff =
      (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60);
    return `${Math.floor(diff)} hrs`;
  };

  const handleAssignClick = (
    inspectionId: number,
    startDateTime: string | null,
    assignedInspectorId: string | null,
  ) => {
    setSelectedInspectionId(inspectionId);
    setSelectedInspectionStart(startDateTime);
    setSelectedAssignedInspectorId(assignedInspectorId);
    setShowAssignModal(true);
  };

  // Callback when new inspection is successfully created
  const handleNewInspectionCreated = async () => {
    showToast("Inspection created successfully", "success");
    await fetchInspections();
  };

  // Callback when inspector assignment is successful
  const handleAssignSuccess = async () => {
    showToast("Inspector assigned successfully", "success");
    await fetchInspections();
  };

  return (
    <>
      <Row className="mb-3">
        <Col className="text-end">
          <Button
            onClick={() => setShowNewModal(true)}
            style={{ width: "140px" }}
          >
            New
          </Button>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Inspection ID</th>
            <th>Location</th>
            <th>Status</th>
            <th>Planned Start</th>
            <th>Actual Start</th>
            <th>Duration</th>
            <th>Result</th>
            <th>Comments</th>
            <th>Assigned Inspector</th>
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
              <td>
                {calculateDuration(insp.actualStartDateTime, insp.endDateTime)}
              </td>
              <td>{insp.result ?? "-"}</td>
              <td>{insp.comments ?? "-"}</td>
              <td>
                {insp.assignedInspector
                  ? `${insp.assignedInspector.firstName} ${insp.assignedInspector.lastName}`
                  : "-"}
              </td>
              <td>
                {insp.status === "YET_TO_START" && (
                  <Button
                    size="sm"
                    onClick={() =>
                      handleAssignClick(
                        insp.id,
                        insp.startDateTime,
                        insp.assignedInspector?.employeeId ?? null,
                      )
                    }
                  >
                    Assign
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <NewInspectionModal
        show={showNewModal}
        onHide={() => setShowNewModal(false)}
        onCreated={handleNewInspectionCreated}
      />

      {selectedInspectionId !== null && (
        <AssignInspectorModal
          show={showAssignModal}
          onHide={() => setShowAssignModal(false)}
          onAssigned={handleAssignSuccess}
          inspectionId={selectedInspectionId}
          currentStartDateTime={selectedInspectionStart}
          assignedInspectorId={selectedAssignedInspectorId}
        />
      )}
    </>
  );
};

export default ManagerInspections;
