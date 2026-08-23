import React from "react";

interface ModalProps {
  open: boolean;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ open, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm rounded-card bg-white p-8 text-center shadow-2xl">{children}</div>
    </div>
  );
};
