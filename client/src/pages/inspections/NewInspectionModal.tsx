import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { baseFetch } from "../../api/baseFetch";
import { useAuth } from "../../context/AuthContext";

interface Location {
  code: string;
  name: string;
}

interface Props {
  show: boolean;
  onHide: () => void;
  onCreated: () => void;
}

const NewInspectionModal = ({ show, onHide, onCreated }: Props) => {
  const { token } = useAuth();

  const [location, setLocation] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [scheduled, setScheduled] = useState(false);
  const [startDateTime, setStartDateTime] = useState("");

  useEffect(() => {
    const fetchLocations = async () => {
      if (!token) return;
      const data = await baseFetch("/locations", {}, token);
      setLocations(data);
    };
    void fetchLocations();
  }, [token]);

  useEffect(() => {
    if (show) {
      setStartDateTime("");
      setScheduled(false);
      setLocation("");
    }
  }, [show]);

  const getNowLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };

  const handleCreate = async () => {
    if (!token) return;
    if (!location) return;

    if (scheduled) {
      if (!startDateTime) return;

      if (new Date(startDateTime) <= new Date()) {
        alert("Start date & time must be in the future");
        return;
      }
    }

    await baseFetch(
      "/inspections",
      {
        method: "POST",
        body: JSON.stringify({
          locationCode: location,
          startDateTime: scheduled ? startDateTime : null,
        }),
      },
      token,
    );

    setLocation("");
    setScheduled(false);
    setStartDateTime("");

    onHide();
    onCreated();
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>New Inspection</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">-- Select Location --</option>
              {locations.map((loc) => (
                <option key={loc.code} value={loc.code}>
                  {loc.name} ({loc.code})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label="Scheduled Inspection?"
              checked={scheduled}
              onChange={(e) => setScheduled(e.target.checked)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Start Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              disabled={!scheduled}
              required={scheduled}
              min={getNowLocal()}
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
          onClick={handleCreate}
          disabled={!location || (scheduled && !startDateTime)}
        >
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewInspectionModal;
