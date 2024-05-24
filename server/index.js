require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
let fetch;

(async () => {
  fetch = (await import('node-fetch')).default;
})();

// The rest of your server code here

// Initialize express app
const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Function to query Flowise
async function queryFlowise(data) {
    const response = await fetch(
        "https://copilot-flowise.onrender.com/api/v1/prediction/1c651f72-d389-4c14-b9c1-5ba80d97d365",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }
    );
    const result = await response.json();
    return result;
}

// Route to handle POST requests
// Route to handle POST requests
// Route to handle POST requests
app.post("/respond", async (req, res) => {
  try {
    const { message } = req.body;
    console.log("MESSAGE: ", message);
    const flowiseResponse = await queryFlowise({ question: message });

    console.log("Flowise Response:", flowiseResponse);
    // Extract relevant data from the Flowise response
    const botResponse = {
      text: flowiseResponse.text,
      chatId: flowiseResponse.chatId,
      chatMessageId: flowiseResponse.chatMessageId,
      sessionId: flowiseResponse.sessionId,
      memoryType: flowiseResponse.memoryType,
      sourceDocuments: flowiseResponse.sourceDocuments ? flowiseResponse.sourceDocuments.map(doc => ({
        pageContent: doc.pageContent,
        metadata: doc.metadata // Assuming you want to send this as is or further process it
      })) : [],
      usedTools: flowiseResponse.usedTools ? flowiseResponse.usedTools.map(tool => ({
        tool: tool.tool,
        toolInput: tool.toolInput, // You might need to handle this object depending on its structure
        toolOutput: tool.toolOutput
      })) : []
    };

    // Send the formatted response back to the client
    res.json({ botResponse });
  } catch (error) {
    console.error("Error calling Flowise:", error);
    res.status(500).json({ error: "Failed to generate response from Flowise" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});