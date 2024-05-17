import React from "react";
import BotResponse from "./BotResponse";

const IntroSection = () => {
  return (
    <div id="introsection">
      <h1>
        <BotResponse response="Introducing Copilot" />
      </h1>
      <h2>
        A cutting-edge AI-powered app that provides instant answers to any
        question you may have. With Talkbot, you'll never be left searching for
        answers again. Whether you need information for school or work, or just
        want to know the latest news, Talkbot has you covered.
      </h2>
      Features:
      <ul>
        <li>Instant answers to any question</li>
      </ul>
      <p>
        Say goodbye to endless searching and typing, and say hello to TalkBot,
        your personal AI assistant. Try it now and see for yourself how TalkBot
        can make your life easier.
      </p>
    </div>
  );
};

export default IntroSection;
