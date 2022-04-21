export default function ToolbarContainer({ children }) {
  return (
    <div className="absolute bottom-0 p-2 border-t border-gray-300 w-full">
      {children}
    </div>
  );
}
