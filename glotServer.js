const express = require("express");
const cors = require("cors");
const { json } = require("express");

const app = express();
const PORT = 9000;

// Enable CORS
app.use(cors());

app.use(json());

app.post("/compile", async (req, res) => {
  try {
    console.log(req);
    const language = req.body.language;
    const fetch = (await import("node-fetch")).default; // Dynamic import
    const response = await fetch(`https://glot.io/api/run/${language}/latest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token b0e0ee4f-07b8-4206-a631-112e16b75234", // Replace with your Glot.io API token
      },
      body: JSON.stringify({
        files: [
          {
            name: req.body.files[0].name,
            content: req.body.files[0].content,
          },
        ],
        stdin: req.body.stdin,
      }),
    });

    console.log(req.body.files[0].content);

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
