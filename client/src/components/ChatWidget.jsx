// import { useState } from "react";
// import axios from "axios";

// const ChatWidget = () => {
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [listening, setListening] = useState(false);

//   let recognition;

//   const sendMessage = async (inputText) => {
//     if (!inputText) return;

//     const userMsg = { sender: "user", text: inputText };
//     setMessages((prev) => [...prev, userMsg]);

//     const token = localStorage.getItem("token");

//     const res = await axios.post(
//       "http://localhost:5173/api/ai/process",
//       { text: inputText },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const botMsg = { sender: "bot", text: res.data.message };
//     setMessages((prev) => [...prev, botMsg]);

//     setText("");
//   };

//   // 🎤 START VOICE
//   const startListening = () => {
//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       alert("Speech not supported");
//       return;
//     }

//     recognition = new SpeechRecognition();

//     recognition.lang = "hi-IN";
//     recognition.continuous = true;       // keep listening
//     recognition.interimResults = true;   // live text

//     recognition.start();
//     setListening(true);

//     recognition.onresult = (event) => {
//       let interim = "";
//       let finalText = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;

//         if (event.results[i].isFinal) {
//           finalText += transcript;
//         } else {
//           interim += transcript;
//         }
//       }

//       // ✍️ live typing effect
//       setText(finalText + interim);
//     };

//     recognition.onend = () => {
//       setListening(false);

//       // 🚀 auto send when user stops speaking
//       if (text.trim()) {
//         sendMessage(text);
//       }
//     };
//   };

//   return (
//     <div className="fixed bottom-5 right-5">
//       {/* Toggle */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="bg-blue-600 text-white p-3 rounded-full"
//       >
//         💬
//       </button>

//       {/* Chat Box */}
//       {open && (
//         <div className="w-80 h-96 bg-white shadow-lg rounded-lg mt-2 p-3 flex flex-col">
//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto text-sm">
//             {messages.length === 0 && (
//               <p className="text-gray-400 text-center mt-10">
//                 🎤 Try speaking your expense...
//               </p>
//             )}

//             {messages.map((m, i) => (
//               <div key={i}>
//                 <b>{m.sender}:</b> {m.text}
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="flex mt-2 gap-1">
//             <input
//               className="flex-1 border p-1"
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//             />

//             <button
//               onClick={() => sendMessage(text)}
//               className="bg-blue-500 text-white px-2"
//             >
//               Send
//             </button>

//             {/* 🎤 Mic */}
//             <button
//               onClick={startListening}
//               className={`px-2 ${listening ? "bg-red-500" : "bg-green-500"} text-white`}
//             >
//               🎤
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWidget;
import { useState } from "react";
import axios from "axios";

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]); // ✅ FIX
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);

  let recognition;

  const sendMessage = async (msg) => {
    if (!msg) return;

    setMessages((prev) => [...prev, { sender: "user", text: msg }]);

    const token = localStorage.getItem("token");

    const res = await axios.post(
      "http://localhost:5173/api/ai/process",
      { text: msg },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: res.data.message },
    ]);

    setText("");
  };

  // 🎤 VOICE (KEEP YOUR LOGIC)
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();

    recognition.lang = "hi-IN";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }

      setText(finalText + interim);
    };

    recognition.onend = () => {
      setListening(false);

      setTimeout(() => {
        setText((prev) => {
          if (prev.trim()) sendMessage(prev);
          return "";
        });
      }, 300);
    };
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
      >
        💬
      </button>

      {/* Chat Box */}
      {open && (
        <div className="w-80 h-[450px] mt-3 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/70 border flex flex-col overflow-hidden">

          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Finance Assistant</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-sm">

            {messages.length === 0 && (
              <p className="text-gray-400 text-center mt-16">
                🎤 Try speaking or typing...
              </p>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-3 py-2 rounded-xl ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {m.text}
              </div>
            ))}

          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">

            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border rounded-lg px-2"
            />

            <button
              onClick={() => sendMessage(text)}
              className="bg-blue-600 text-white px-3 rounded-lg"
            >
              ➤
            </button>

            {/* 🎤 Mic */}
            <button
              onClick={startListening}
              className={`p-2 rounded-full text-white ${
                listening ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            >
              🎤
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

export default ChatWidget;