import { useEffect, useRef, useState } from 'react';
import { useFetchChatHistory, useMutationSendMessage } from '~/apis/chatApis';
import Icons from '~/assets/icons';
import LoadingDots from './LoadingDots';
// import { FiMessageCircle } from 'react-icons/fi'; // dùng react-icons

// eslint-disable-next-line react/prop-types
const ChatBox = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const bottomRef = useRef(null); // ref để scroll tới cuối

  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (currentMessage) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessage]);

  const { data: dataHistoryChat, refetch, isLoading } = useFetchChatHistory();

  const { mutate } = useMutationSendMessage();

  const handleSend = () => {
    if (input?.trim() === '') return;

    setCurrentMessage(input.trim());
    mutate(
      {
        message: input.trim(),
        file: null,
      },
      {
        onSuccess: () => {
          refetch();
          setCurrentMessage('');
        },
      }
    );

    setInput('');
  };

  return (
    <div className="fixed bottom-20 right-6 w-[450px] h-3/6 bg-white border rounded-lg shadow-lg flex flex-col z-50">
      {/* Header */}
      <div className="p-3 border-b flex justify-between items-center bg-orange-400 text-white">
        <span>ChatBot</span>
        <button onClick={onClose} className="text-white font-bold text-xl">
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {dataHistoryChat?.map((msg, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-xs ${
              msg?.messageType === 'USER'
                ? 'ml-auto bg-orange-400 text-white'
                : 'mr-auto bg-gray-200 text-black'
            }`}
          >
            {msg?.text}
          </div>
        ))}
        {currentMessage && (
          <div className={`p-2 rounded-lg max-w-xs ${'ml-auto bg-orange-400 text-white'}`}>
            {currentMessage}
          </div>
        )}

        {currentMessage && (
          <div className="mr-auto">
            <LoadingDots />
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* Input */}
      <div className="p-3 border-t flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e?.target?.value)}
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="Nhập tin nhắn..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-orange-400 text-white px-3 py-2 rounded hover:bg-orange-600"
        >
          Gửi
        </button>
      </div>
    </div>
  );
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Icon */}
      <button
        className="fixed bottom-6 right-6 bg-orange-400 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 z-40"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icons.Chat />
        {/* <FiMessageCircle size={24} /> */}
      </button>

      {/* ChatBox */}
      {isOpen && <ChatBox onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default ChatWidget;
