import { createContext, useContext, useState, type ReactNode } from "react";
import { AlertModal } from "@/components/ui/AlertModal";

interface ConfirmState {
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface ConfirmContextValue {
  confirm: (message: string, onConfirm: () => void, options?: { confirmLabel?: string; cancelLabel?: string }) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfirmState | null>(null);

  function confirm(
    message: string,
    onConfirm: () => void,
    options?: { confirmLabel?: string; cancelLabel?: string },
  ) {
    setState({ message, onConfirm, ...options });
  }

  function handleCancel() {
    setState(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && (
        <AlertModal
          message={state.message}
          onConfirm={state.onConfirm}
          onCancel={handleCancel}
          confirmLabel={state.confirmLabel}
          cancelLabel={state.cancelLabel}
        />
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
