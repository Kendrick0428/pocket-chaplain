"use client";

export function ConfirmButton({ message, children }: { message: string; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="btn danger small"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
