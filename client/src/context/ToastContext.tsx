import { createContext, useContext, useState, type ReactNode } from "react";
import { Toast, ToastContainer } from "react-bootstrap";

type ToastVariant = "success" | "danger" | "warning" | "info";

interface ToastContextType {
  showToast: (message: string, variant?: ToastVariant, delay?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
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

export const ToastProvider = ({
  children,
  position = "bottom-center",
}: ToastProviderProps) => {
  const [toasts, setToasts] = useState<
    { id: number; message: string; variant: ToastVariant; delay: number }[]
  >([]);

  const showToast = (
    message: string,
    variant: ToastVariant = "success",
    delay: number = 3000,
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, variant, delay }]);
  };

  const handleClose = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <ToastContainer position={position} className="p-3">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            bg={t.variant}
            onClose={() => handleClose(t.id)}
            show
            delay={t.delay}
            autohide
          >
            <Toast.Body className="text-white">{t.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
