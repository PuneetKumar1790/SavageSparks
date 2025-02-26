require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL_NAME = process.env.MODEL_NAME;

app.use(
    cors({
      origin: "https://savage-sparks.vercel.app", // Allow only this origin
      methods: ["GET", "POST"], // Allow specific methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
      credentials: true, // Allow cookies if needed
    })
  );
  
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { name, mode } = req.body;

    let prompt = "";

    if (mode === "intro") {
        if (!name) {
            return res.status(400).json({ error: "Please enter some details about yourself." });
        }
        prompt = `Yeh banda apne baare me bata raha hai: ${name}. Ab ise brutally Hinglish style mein roast kar`;
    } else if (mode === "roast") {
        prompt = "Ek random aadmi ko funny Hinglish style mein roast kar, jaise dost ek dusre ko mazak mazak mein roast karte hain.";
    } else {
        return res.status(400).json({ error: "Invalid mode. Choose 'intro' or 'roast'." });
    }

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: MODEL_NAME,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const aiResponse = response.data.choices[0].message.content;
        console.log(aiResponse);
        res.json({ message: aiResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Server is running on http://localhost:${PORT}`);
});
