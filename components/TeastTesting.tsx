// Example usage in a component
"use client";

import { useToast } from "@/providers/ToastProvider";

export function ExampleComponent() {
  const { addToast } = useToast();

  const showToast = () => {
    addToast({
      title: "Success!",
      description: "Your action was completed successfully.",
      type: "success",
      duration: 5000,
    });
  };

  const showError = () => {
    addToast({
      title: "Error",
      description: "Something went wrong. Please try again.",
      type: "error",
    });
  };

  const showWarning = () => {
    addToast({
      title: "Warning",
      description: "This action cannot be undone.",
      type: "warning",
    });
  };

  const showInfo = () => {
    addToast({
      title: "Information",
      description: "Here is some important information.",
      type: "info",
    });
  };

  return (
    <div className="p-8 space-y-4">
      <button
        onClick={showToast}
        className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
      >
        Show Success Toast
      </button>

      <button
        onClick={showError}
        className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary/80 border border-border"
      >
        Show Error Toast
      </button>

      <button
        onClick={showWarning}
        className="bg-muted text-foreground px-4 py-2 rounded hover:bg-accent"
      >
        Show Warning Toast
      </button>

      <button
        onClick={showInfo}
        className="bg-background text-foreground border border-input px-4 py-2 rounded hover:bg-accent"
      >
        Show Info Toast
      </button>
    </div>
  );
}
