import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import { useAuth } from "../../context/AuthContext";
import type { Inspector } from "../../types/user";
import { formatTimezone } from "../../utils/formatTimezone";

interface Props {
  show: boolean;
  onHide: () => void;
  onAssigned: () => void;
  inspectionId: number;
  currentStartDateTime: string | null;
  assignedInspectorId: string | null;
}

const AssignInspectorModal = ({
  show,
  onHide,
  onAssigned,
  inspectionId,
  currentStartDateTime,
  assignedInspectorId,
}: Props) => {
  const { token } = useAuth();
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [assignedInspector, setAssignedInspector] = useState<string>(
    assignedInspectorId ?? "",
  );
  const [changeStart, setChangeStart] = useState<boolean>(false);
  const [startDateTime, setStartDateTime] = useState<string>(
    formatTimezone(currentStartDateTime),
  );

  useEffect(() => {
    if (!currentStartDateTime) return;
    setStartDateTime(currentStartDateTime);
    if (new Date(currentStartDateTime) <= new Date()) {
      setChangeStart(true);
    } else {
      setChangeStart(false);
    }
  }, [currentStartDateTime]);

  useEffect(() => {
    if (show) {
      setStartDateTime(formatTimezone(currentStartDateTime));
      setChangeStart(false);
      setAssignedInspector(assignedInspectorId ?? "");
    }
  }, [show]);

  useEffect(() => {
    const fetchInspectors = async () => {
      if (!token) return;
      const data = await baseFetch("/users?role=INSPECTOR", {}, token);
      setInspectors(data);
    };
    void fetchInspectors();
  }, [token]);

  const getNowLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  const handleAssign = async () => {
    if (!token || !assignedInspector) return;

    if (
      changeStart &&
      (!startDateTime || new Date(startDateTime) <= new Date())
    ) {
      alert("Start date & time must be in the future");
      return;
    }

    await baseFetch(
      `/inspections/${inspectionId}/assign`,
      {
        method: "PATCH",
        body: JSON.stringify({
          employeeId: assignedInspector,
          startDateTime: changeStart ? startDateTime : currentStartDateTime,
        }),
      },
      token,
    );

    setAssignedInspector("");
    setChangeStart(false);
    setStartDateTime("");

    onHide();
    onAssigned();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Assign Inspector</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Select Inspector</Form.Label>
            <Form.Select
              value={assignedInspector}
              onChange={(e) => setAssignedInspector(e.target.value)}
            >
              <option value="">-- Select Inspector --</option>
              {inspectors.map((ins) => (
                <option key={ins.employeeId} value={ins.employeeId}>
                  {ins.firstName} {ins.lastName} ({ins.employeeId})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="Change Start Date & Time?"
              checked={changeStart}
              onChange={(e) => setChangeStart(e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              required
              min={getNowLocal()}
              disabled={!changeStart}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleAssign}
          disabled={!assignedInspector || (changeStart && !startDateTime)}
        >
          Assign
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AssignInspectorModal;
