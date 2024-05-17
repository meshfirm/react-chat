import React, { useEffect, useRef, useState } from "react";
import Avatar from "../components/Avatar";
import BotResponse from "../components/BotResponse";
import Error from "../components/Error";
import IntroSection from "../components/IntroSection";
import Loading from "../components/Loading";
import NavContent from "../components/NavContent";

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
      const newChatLogEntry = { chatPrompt: inputPrompt, botMessage: "Loading..." };
      setChatLog((prevChatLog) => [...prevChatLog, newChatLogEntry]);

      e.target.querySelector("input").blur();
      setInputPrompt("");
      setResponseFromAPI(true);

      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || "https://react-chat-backend-xquc.onrender.com";

        const response = await fetch(`${backendUrl}/respond`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: inputPrompt }),
        });
        const data = await response.json();

        setChatLog((prevChatLog) => [
          ...prevChatLog.slice(0, prevChatLog.length - 1),
          { ...newChatLogEntry, botMessage: data.botResponse },
        ]);

        setErr(false);
      } catch (error) {
        setErr(error);
        console.error(error);
      } finally {
        setResponseFromAPI(false);
      }
    }
  };

  useEffect(() => {
    if (chatLogEndRef.current) {
      chatLogEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [chatLog]);

  return (
    <>
      <header>
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
        <nav>
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
              <path d="m53.691 50.609 13.467-13.467a2 2 0 1 0-2.828-2.828L50.863 47.781 37.398 34.314a2 2 0 1 0-2.828 2.828l13.465 13.467-14.293 14.293a2 2 0 1 0 2.828 2.828l14.293-14.293L65.156 67.73c.391.391.902.586 1.414.586s1.023-.195 1.414-.586a2 2 0 0 0 0-2.828L53.691 50.609z" />
            </svg>
          </div>
        </nav>
      )}

      <aside className="sideMenu">
        <NavContent
          chatLog={chatLog}
          setChatLog={setChatLog}
          setShowMenu={setShowMenu}
        />
      </aside>

      <section className="chatBox">
        {chatLog.length > 0 ? (
          <div className="chatLogWrapper">
            {chatLog.map((chat, idx) => (
              <div className="chatLog" key={idx} id={`chat-${idx}`}>
                <div className="chatPromptMainContainer">
                  <div className="chatPromptWrapper">
                    <Avatar bg="#5437DB" className="userSVG">
                      {/* User avatar */}
                    </Avatar>
                    <div id="chatPrompt">{chat.chatPrompt}</div>
                  </div>
                </div>
                <div className="botMessageMainContainer">
                  <div className="botMessageWrapper">
                    <Avatar bg="#11a27f" className="openaiSVG">
                      {/* Bot avatar */}
                    </Avatar>
                    {chat.botMessage === "Loading..." ? (
                      <Loading />
                    ) : err ? (
                      <Error err={err} />
                    ) : (
                      <div id="botMessage">
                        <BotResponse response={chat.botMessage} chatLogRef={chatLogEndRef} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatLogEndRef} />{" "}
          </div>
        ) : (
          <IntroSection />
        )}

        <form onSubmit={handleSubmit}>
          <div className="inputPromptWrapper">
            <input
              name="inputPrompt"
              className="inputPrompttTextarea"
              type="text"
              rows="1"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              autoFocus
            ></input>
            <button aria-label="form submit" type="submit">
              <svg
                fill="#ADACBF"
                width={15}
                height={20}
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#212023"
                strokeWidth={0}
              >
                <title>{"submit form"}</title>
                <path
                  d="m30.669 1.665-.014-.019a.73.73 0 0 0-.1.665-.014-.019a.73.73 0 0 0-.16-.21h-.001c-.013-.011-.032-.005-.046-.015-.02-.016-.028-.041-.05-.055a.713.713 0 0 0-.374-.106l-.05.002h.002a.628.628 0 0 0-.095.024l.005-.001a.76.76 0 0 0-.264.067l.005-.002-27.999 16a.753.753 0 0 0 .053 1.331l.005.002 9.564 4.414v6.904a.75.75 0 0 0 1.164.625l-.003.002 6.259-4.106 9.015 4.161c.092.043.2.068.314.068H28a.75.75 0 0 0 .747-.695v-.0026.82-8.143-3.758zM12.75 28.611v-5.02l4.5 2.073zM28.611 12.75l-5.02 4.5-2.073-4.5z"
                  />
                </svg>
              </button>
            </div>
          </form>
        </section>
      </>
    );
  };
  
  export default Home;