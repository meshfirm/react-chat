import { assets } from '../../assets/assets';
import './Main.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { Context } from '../../context/Context';

export default function Main() {
  const { onSent, conversationHistory, showResult, loading, newChat } = useContext(Context);
  const [inputString, setInputString] = useState('');
  const resultRef = useRef(null);

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [conversationHistory, loading]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && inputString.trim()) {
      onSent(inputString);
      setInputString('');
    }
  };

  const handleInputChange = (event) => {
    setInputString(event.target.value);
  };

  const handleSendClick = () => {
    if (inputString.trim()) {
      onSent(inputString);
      setInputString('');
    }
  };

  return (
    <div className='main'>
      <div className="nav">
        <p onClick={() => newChat()} className='navlogo'>Copilot</p>
        <img src={assets.mesh_Logo} alt="Mesh Logo" />
      </div>

      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p><span>Hello, Sebastian!</span></p>
              <p>How can I help you today?</p>
            </div>
            <p className='tagname'>Tools Ready to use</p>

            <div className="cards">
              {["Create Product Roadmap", "Create Product Strategy", "Create Epic", "Create User Story"].map((text) => (
                <div key={text} className='card' onClick={() => onSent(`Cards: ${text}`)}>
                  <p>{text}</p>
                  <img src={assets.compass_icon} alt="Compass Icon" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className='result' ref={resultRef}>
            {conversationHistory.map((entry, index) => (
              <div key={index} className='result-entry'>
                <div className='result-title'>
                  <img src={assets.user_icon} alt="User Icon" />
                  <p>{entry.question}</p>
                </div>
                <div className='result-data'>
                  <img src={assets.mesh_Logo} alt="Mesh Logo" />
                  <p dangerouslySetInnerHTML={{ __html: entry.response }}></p>
                </div>
              </div>
            ))}
            {loading && (
              <div className='loader'>
                <div></div>
                <div></div>
                <div></div>
              </div>
            )}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              value={inputString}
              type="text"
              placeholder="Search tools..."
            />
            <div>
              <img src={assets.gallery_icon} alt="Gallery Icon" />
              <img src={assets.mic_icon} alt="Mic Icon" />
              {inputString ? (
                <img
                  onClick={handleSendClick}
                  src={assets.send_icon}
                  alt="Send Icon"
                />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">Hepha AI Powered by Mesh Firm</p>
        </div>
      </div>
    </div>
  );
}

