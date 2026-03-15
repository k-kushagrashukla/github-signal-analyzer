const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  try {

    const { repoUrl } = req.body;

    const parts = repoUrl.split("github.com/")[1].split("/");
    const owner = parts[0];
    const repo = parts[1];

    const githubRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    const data = githubRes.data;

    const repoInfo = `
Repo: ${data.full_name}
Description: ${data.description}
Stars: ${data.stargazers_count}
Forks: ${data.forks_count}
Language: ${data.language}
Open Issues: ${data.open_issues_count}
`;

    const aiResponse = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Analyze this GitHub repo and generate developer signals and GTM insights:\n\n${repoInfo}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const result = aiResponse.data.choices[0].message.content;

    res.json({ result });

  } catch (error) {

    console.error(error.response?.data || error.message);

    res.status(500).json({ error: "Something went wrong" });

  }
});

module.exports = router;