
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { useState, useContext } from 'react';
import { Context } from '../../context/Context';

export default function Sidebar() {
  const { sessionId } = useContext(Context);

  const [extended, setExtended] = useState(false);
  const [showMore, setShowMore] = useState(false); // State to track "Show More" or "Show Less"
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  const handleShowMore = () => {
    setShowMore(!showMore); // Toggle showMore state
  };

  return (
    <div className='sidebar'>
    
      <div className="top">
        
        <img onClick={() => setExtended(!extended)} className='menu' src={assets.menu_icon} alt="" />
        <div onClick={() => newChat()} className='new-chat'>
          
          <img src={assets.plus_icon} alt="" />
          {extended && <p>New Chat</p>}
        </div>

        {extended && prevPrompts && (
          <div className='recent'>
              <div className='recent'>
        <p>Session ID: {sessionId}</p>
      </div>
            <p className="recent-title">Recent</p>
            {prevPrompts.slice(0, showMore ? prevPrompts.length : 5).map((item, index) => (
              <div key={index} onClick={() => loadPrompt(item)} className="recent-entry">
                <img src={assets.message_icon} alt="" />
                <p>{item.slice(0, 18)} ...</p>
              </div>
            ))}
            {prevPrompts.length > 5 && (
              <span onClick={handleShowMore} className="show-more">
                {showMore ? 'Show Less' : 'Show More'}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img className="avater" src={assets.mesh_Logo} alt="" />
          {extended && <p>Profile</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="" />
          {extended && <p>Settings</p>}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="" />
          {extended && <p>Help</p>}
        </div>
      </div>
    </div>
  );
}