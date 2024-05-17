import React, { useEffect, useState } from "react";

const BotResponse = ({ response, chatLogRef }) => {
  const [botResponse, setBotResponse] = useState("");
  const [isPrinting, setIsPrinting] = useState(true);
  const [isButtonVisible, setIsButtonVisible] = useState(false);

  useEffect(() => {
    if (!response || !response.text) {
      return;
    }

    let index = 1;
    let msg = setInterval(() => {
      if (response.text !== " - The Ultimate AI Assistant") {
        setIsButtonVisible(true);
      }
      if (!isPrinting) {
        clearInterval(msg);
        return;
      }
      setBotResponse(response.text.slice(0, index));
      if (index >= response.text.length) {
        clearInterval(msg);
        setIsButtonVisible(false);
      }
      index++;

      if (chatLogRef !== undefined) {
        chatLogRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    }, 50);
    return () => clearInterval(msg);
  }, [chatLogRef, response, isPrinting]);

  const stopPrinting = () => setIsPrinting(!isPrinting);

  return (
    <>
      <pre>
        {botResponse}
        {botResponse === response.text ? "" : "|"}
      </pre>
      {isButtonVisible && (
        <button className="stop-message" onClick={stopPrinting}>
          {isPrinting ? "Stop Message" : "Regenerate Message"}
        </button>
      )}
    </>
  );
};

export default BotResponse;