import React from "react";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
  position?: "center" | "bottom";
}

export const Modal: React.FC<ModalProps> = ({ open, children, position = "center" }) => {
  if (!open) return null;

  if (position === "bottom") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:items-center">
        <div className="w-full max-w-lg rounded-t-card bg-white p-6 pb-8 shadow-2xl lg:rounded-card">
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200 lg:hidden" />
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm rounded-card bg-white p-8 text-center shadow-2xl">{children}</div>
    </div>
  );
};
