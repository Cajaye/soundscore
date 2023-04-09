const spotifyToken = async () => {
  const client_id = process.env.SPOTIFY_CLIENT_ID as string;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET as string;

  const token = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",

      Accept: "application/json",

      Authorization:
        "Basic " +
        Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    body: "grant_type=client_credentials",
  });

  const t = (await token.json()) as {
    access_token: string;
    token_type: string;
    expires_in: number;
  };

  return t;
};

export default spotifyToken;
