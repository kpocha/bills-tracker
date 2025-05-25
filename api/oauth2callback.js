export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No code provided!" });
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await response.json();
    
    console.log("Tokens response:", tokens); // 

    if (tokens.error) {
      return res.status(400).json(tokens);
    }

    return res.status(200).json(tokens);
  } catch (error) {
    console.error("OAuth callback error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}