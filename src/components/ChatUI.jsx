import { useState, useEffect } from "react";
import ClearChatButton from "./ClearChatButton";
import { detectLanguage, translateText, createSummarizer } from "../utils/translate";

export default function ChatUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [detectedLanguage, setDetectedLanguage] = useState("en");
  const [detecting, setDetecting] = useState(false);
  const [error, setError] = useState(null);
  const [showSummarize, setShowSummarize] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const supportedLanguages = {
    en: "English",
    es: "Spanish",
    ru: "Russian",
    fr: "French",
    tr: "Turkish",
    pt: "Portuguese",
  };

  useEffect(() => {
    const detect = async () => {
      if (input.trim()) {
        setDetecting(true);
        const lang = await detectLanguage(input);
        setDetectedLanguage(lang || "en");
        setDetecting(false);
        setShowSummarize(input.length > 149);
      } else {
        setShowSummarize(false);
      }
    };

    const timer = setTimeout(detect, 500);
    return () => clearTimeout(timer);
  }, [input]);

  const sendMessage = async (summarize = false) => {
    if (!input.trim()) return;

    setError(null);

    if (input.length < 150 && detectedLanguage === targetLanguage) {
      setError("Message too short or already in the selected language.");
      return;
    }

    const userMessage = { role: "user", content: input, lang: detectedLanguage };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    let responseText = input;

    if (summarize && input.length > 149) {
      setLoadingSummary(true);

      const summarizer = await createSummarizer();
      if (summarizer) {
        try {
          responseText = await summarizer.summarize(input, {
            context: "This is a user message in a chat application.",
          });
        } catch (error) {
          console.error("Summarization failed:", error);
          setError("Summarization failed. Try again.");
          setLoadingSummary(false);
          return;
        }
      }

      setLoadingSummary(false);
    }

    const translatedResponse = await translateText(responseText, detectedLanguage, targetLanguage);

    const botMessage = { role: "bot", content: translatedResponse, lang: targetLanguage };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-2">
        <ClearChatButton messages={messages} setMessages={setMessages} />
        <select
          className="px-4 py-2 border rounded-lg"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
        >
          {Object.entries(supportedLanguages).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-auto space-y-2 p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-300 text-black self-start"}`}>
            {msg.content} <span className="text-xs text-gray-500">({msg.lang})</span>
          </div>
        ))}

        {loadingSummary && (
          <div className="self-start bg-gray-300 text-black px-3 py-2 rounded-lg max-w-xs flex items-center">
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
            </div>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 text-sm text-center p-2">{error}</div>}

      <div className="flex items-center p-2 bg-white border-t">
        <div className="flex items-center flex-1 border rounded-lg px-3">
          <input
            type="text"
            className="flex-1 p-2 focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          {input.trim() && (
            <span className="text-sm text-gray-500 ml-2">
              {detecting ? "Detecting..." : supportedLanguages[detectedLanguage] || "Detecting..."}
            </span>
          )}
        </div>
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={() => sendMessage(false)}>
          Send
        </button>
        {showSummarize && (
          <button className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg" onClick={() => sendMessage(true)}>
            Summarize
          </button>
        )}
      </div>
    </div>
  );
}
