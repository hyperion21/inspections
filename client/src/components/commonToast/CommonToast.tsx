import { Toast, ToastContainer } from "react-bootstrap";

interface CommonToastProps {
  show: boolean;
  message: string;
  variant?: "success" | "danger" | "warning" | "info";
  onClose: () => void;
  delay?: number;
  position?:
    | "top-start"
    | "top-center"
    | "top-end"
    | "middle-start"
    | "middle-center"
    | "middle-end"
    | "bottom-start"
    | "bottom-center"
    | "bottom-end";
}

const CommonToast = ({
  show,
  message,
  variant = "success",
  onClose,
  delay = 3000,
  position = "bottom-center",
}: CommonToastProps) => {
  return (
    <ToastContainer position={position} className="p-3">
      <Toast bg={variant} onClose={onClose} show={show} delay={delay} autohide>
        <Toast.Body className="text-white">{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CommonToast;
