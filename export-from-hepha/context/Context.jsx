import { createContext, useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; 
import { query as searchQuery } from '../api/api'; 
import { queryRoadmap as cardsQueryRoadmap } from '../api/api'; 
import { queryStrategy as cardsQueryStrategy } from '../api/api'; 

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [response, setResponse] = useState('');
  const [recentPrompt, setRecentPrompt] = useState("");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [sessionId, setSessionId] = useState(uuidv4());
  const resultRef = useRef(null);

  useEffect(() => {
    const storedState = localStorage.getItem('chatAppState');
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      setInput(parsedState.input);
      setPrevPrompts(parsedState.prevPrompts);
      setShowResult(parsedState.showResult);
      setLoading(parsedState.loading);
      setResultData(parsedState.resultData);
      setResponse(parsedState.response);
      setRecentPrompt(parsedState.recentPrompt);
      setConversationHistory(parsedState.conversationHistory || []);
      setCurrentConversation(parsedState.currentConversation);
      setSessionId(parsedState.sessionId || uuidv4());
    }
  }, []);

  useEffect(() => {
    const chatAppState = JSON.stringify({
      input,
      prevPrompts,
      showResult,
      loading,
      resultData,
      response,
      recentPrompt,
      conversationHistory,
      currentConversation,
      sessionId,
    });
    localStorage.setItem('chatAppState', chatAppState);
  }, [input, prevPrompts, showResult, loading, resultData, response, recentPrompt, conversationHistory, currentConversation, sessionId]);

  const delayWord = (index, word) => {
    setTimeout(() => {
      setResultData(prev => prev + word + " ");
    }, 75 * index);
  };

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [resultData, resultRef]);

  const fetchResponse = async (queryFunc, input) => {
    try {
      setLoading(true);
      setShowResult(true);

      const response = await queryFunc({ question: input, sessionId });
      setRecentPrompt(input);

      const formattedResponse = response.text.replace(/\n/g, "<br>");
      formattedResponse.split(/\s+/).forEach((word, index) => delayWord(index, word));

      return response;
    } catch (error) {
      console.error("Error:", error.message);
      throw error;
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const runChat = async (input) => fetchResponse(searchQuery, input);
  const runRoadmapChat = async (input) => fetchResponse(cardsQueryRoadmap, input);
  const runStrategyChat = async (input) => fetchResponse(cardsQueryStrategy, input);

  const newChat = () => {
    setCurrentConversation(null);
    setLoading(false);
    setShowResult(false);
    setConversationHistory([]); // Clear conversation history
    setSessionId(uuidv4());
  };

  const onSent = async (prompt) => {
    try {
      setLoading(true);
      setShowResult(true);

      let response;
      if (prompt.startsWith("Cards:")) {
        const cardPrompt = prompt.substring(7);
        if (cardPrompt === "Create Product Roadmap") {
          response = await runRoadmapChat(cardPrompt);
        } else if (cardPrompt === "Create Product Strategy") {
          response = await runStrategyChat(cardPrompt);
        } else {
          response = await runChat(prompt);
        }
      } else {
        response = await runChat(prompt);
      }

      setPrevPrompts(prev => [...prev, prompt]);

      const responseParts = response.text.split("**");
      const formattedResponse = responseParts.map((part, index) => (index % 2 === 1 ? `<b>${part}</b>` : part)).join("");

      const newConversationEntry = { question: prompt, response: formattedResponse };
      setConversationHistory(prev => [...prev, newConversationEntry]);
      setCurrentConversation(newConversationEntry);
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    setShowResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    showResult,
    setLoading,
    setResultData,
    response,
    setResponse,
    resultRef,
    conversationHistory,
    setConversationHistory,
    currentConversation,
    sessionId,
  };

  return <Context.Provider value={contextValue}>{props.children}</Context.Provider>;
};

export default ContextProvider;
