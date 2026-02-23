import { Badge } from "react-bootstrap";
import type { InspectionStatus } from "../../../types/inspection";

interface Props {
  status: InspectionStatus;
}

const statusColors: Record<InspectionStatus, string> = {
  YET_TO_START: "secondary", // gray
  IN_PROGRESS: "info", // blue
  COMPLETED: "success", // green
  ABANDONED: "danger", // red
};

const InspectionStatusTag = ({ status }: Props) => {
  return <Badge bg={statusColors[status]}>{status.replaceAll("_", " ")}</Badge>;
};

export default InspectionStatusTag;
