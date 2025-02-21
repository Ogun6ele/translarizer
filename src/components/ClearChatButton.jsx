import { toast } from "react-hot-toast";

function ClearChatButton({ messages, setMessages }) {
    const clearMessages = () => {
      if (messages.length === 0) return;
  
      toast((t) => (
        <div>
          <p className="mb-8">Are you sure you want to clear the chat?</p>
          <div className="flex justify-center space-x-2 mt-2">
            <button
              className="px-4 py-2 w-[50%] bg-red-500 text-white rounded-lg"
              onClick={() => {
                setMessages([]);
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 w-[50%] bg-gray-300 text-black rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              No
            </button>
          </div>
        </div>
      ));
    };
  
    return (
      <button className="mb-2 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={clearMessages}>
        Clear Chat
      </button>
    );
  }

  export default ClearChatButton;