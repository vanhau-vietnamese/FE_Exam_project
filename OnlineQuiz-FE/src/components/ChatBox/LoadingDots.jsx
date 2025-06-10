export default function LoadingDots() {
  return (
    <div className="flex space-x-1 justify-center items-center">
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
      <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></span>
      <span className="ml-3">Đang trả lời</span>
    </div>
  );
}
