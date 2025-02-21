import ChatUI from "./components/ChatUI";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the user is on a mobile or tablet
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };

    checkDevice();
  }, []);

  if (isMobile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">🚫 Unsupported Device</h1>
          <p className="text-lg">
            This site only works on laptops and desktop computers. <br />
            Please visit on a supported device.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <ChatUI />
    </div>
  );
}


export default App;