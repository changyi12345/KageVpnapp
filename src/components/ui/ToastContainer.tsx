export function ToastContainer({ toasts, onClose }: { toasts: any[]; onClose: (id: string) => void }) {
  // ... existing code ...
  return (
    <div suppressHydrationWarning className="fixed top-4 right-4 z-50 space-y-2">
      {/* ... existing code ... */}
    </div>
  );
  // ... existing code ...
}