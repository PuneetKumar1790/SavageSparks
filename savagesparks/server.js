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
      methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods
      allowedHeaders: ["Content-Type", "Authorization"], // Allow specific headers
      credentials: true, // Allow cookies if needed
    })
  );
app.use(express.json());

app.post("/generate", async (req, res) => {
    const { name, mode } = req.body;

    if (mode !== "intro" && mode !== "roast") {
        return res.status(400).json({ error: "Invalid mode. Choose 'intro' or 'roast'." });
    }

    // 🔥 Structured prompt for better roasting
    let prompt = mode === "intro"
        ? `Yeh banda apne baare me bata raha hai: "${name}". Iska brutal, funny, Hinglish style mein roast likh, jaise dost ek dusre ka mazak udate hain. Roasting should be sarcastic, relatable, and engaging.`
        : `Ek random aadmi ko funny Hinglish style mein roast kar. Mazak mazak mein sharp aur witty tareeke se roast likh, lekin offensive mat ho.`;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: MODEL_NAME,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 1000,  // 🔥 Increased limit for full response
                temperature: 0.8,
                top_p: 0.9,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Full API Response:", JSON.stringify(response.data, null, 2));

        const aiResponse = response.data.choices?.[0]?.message?.content || "Koi error ho gaya, dosto!";
        res.json({ message: aiResponse });
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Something went wrong! Try again later." });
    }
});

app.listen(PORT, () => {
    console.log(`🔥 Server running on http://localhost:${PORT}`);
});
