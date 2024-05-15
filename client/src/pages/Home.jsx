import React, { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import BotResponse from "../components/BotResponse";
import Error from "../components/Error";
import IntroSection from "../components/IntroSection";
import Loading from "../components/Loading";
import NavContent from "../components/NavContent";
import SvgComponent from "../components/SvgComponent";

const Home = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [err, setErr] = useState(false);
  const [responseFromAPI, setResponseFromAPI] = useState(false);

  const chatLogEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!responseFromAPI && inputPrompt.trim() !== "") {
      const newChatLogEntry = { chatPrompt: inputPrompt, botMessage: null };
      setChatLog((prevChatLog) => [...prevChatLog, newChatLogEntry]);

      // hide the keyboard in mobile devices
      e.target.querySelector("input").blur();

      setInputPrompt(""); // Clear input after submitting
      setResponseFromAPI(true); // Indicate that a response is being awaited

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://react-chat-backend-xquc.onrender.com";

        const response = await fetch(`${backendUrl}/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputPrompt }),
        });
        const data = await response.json();

        // Update chat log with the new response
        setChatLog((prevChatLog) => [
          ...prevChatLog.slice(0, prevChatLog.length - 1), // all entries except the last
          { ...newChatLogEntry, botMessage: data.botResponse }, // update the last entry with the bot's response
        ]);

        setErr(false);
      } catch (error) {
        setErr(error);
        console.error(error);
      } finally {
        setResponseFromAPI(false); // Reset after receiving the response
      }
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat log to show the latest message
    if (chatLogEndRef.current) {
      chatLogEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatLog]);

  return (
    <>
      <header className="nav">
        <div className="menu">
          <button onClick={() => setShowMenu(true)}>
            <svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              stroke="#d9d9e3"
              strokeLinecap="round"
            >
              <path d="M21 18H3M21 12H3M21 6H3" />
            </svg>
          </button>
        </div>
        <h1>TalkBot</h1>
      </header>

      {showMenu && (
        <nav className="sidebar">
          <div className="navItems">
            <NavContent
              chatLog={chatLog}
              setChatLog={setChatLog}
              setShowMenu={setShowMenu}
            />
          </div>
          <div className="navCloseIcon">
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              xmlSpace="preserve"
              stroke="#fff"
              width={42}
              height={42}
              onClick={() => setShowMenu(false)}
            >
              <path d="m53.691 50.609 13.467-13.467a2m53.691 50.609 13.467-13.467a2.5 2.5 0 1 0-3.536-3.536L50.155 47.073 36.688 33.606a2.5 2.5 0 1 0-3.536 3.536l13.467 13.467-13.467 13.467a2.5 2.5 0 1 0 3.536 3.536l13.467-13.467 13.467 13.467a2.5 2.5 0 1 0 3.536-3.536L53.691 50.609z" />
            </svg>
          </div>
        </nav>
      )}

      <main className="main">
        <div className="main-container">
          <IntroSection />
          {chatLog.map((entry, index) => (
            <div key={index} className="result">
              <div className="result-title">
                <Avatar />
                <p>{entry.chatPrompt}</p>
              </div>
              {entry.botMessage ? (
                <BotResponse message={entry.botMessage} />
              ) : (
                <Loading />
              )}
            </div>
          ))}
          {err && <Error error={err} />}
          <div ref={chatLogEndRef} />
        </div>
        <div className="main-bottom">
          <form onSubmit={handleSubmit} className="search-box">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder="Type your message..."
            />
            <div>
              <button type="submit">
                <SvgComponent />
              </button>
            </div>
          </form>
          <p className="bottom-info">Hepha AI Powered by Mesh Firm</p>
        </div>
      </main>
    </>
  );
};

export default Home;