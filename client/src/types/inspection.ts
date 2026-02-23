export type InspectionStatus =
  | "YET_TO_START"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export type InspectionResult = "PASS" | "FAIL";

export interface Inspection {
  id: number;
  location: {
    code: string;
    name: string;
  };
  status: InspectionStatus;
  assignedInspector: {
    employeeId: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
  startDateTime: string | null;
  actualStartDateTime: string | null;
  endDateTime: string | null;
  result: InspectionResult | null;
  comments: string | null;
  createdDate: string;
  lastUpdatedDate: string;
}
