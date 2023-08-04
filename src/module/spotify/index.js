import Playlist from "./sections/Playlist";
import MostPlayed from "./sections/MostPlayed";
import { useState, useEffect } from "react";
import axios from "axios";

function Spotify() {
  const clientId = "1be0bcdacb0d4844a31d5f342065f102";
  const redirectUri = "http://localhost:3000/";
  const AUTHORIZE = "https://accounts.spotify.com/authorize";
  const [playList, setPlayList] = useState([]);
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [seachResults, setSearchResults] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const login = async () => {
    const generateRandomString = (length) => {
      let text = "";
      let possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    };

    const generateCodeChallenge = async (codeVerifier) => {
      const base64encode = (string) => {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(string)))
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");
      };

      const encoder = new TextEncoder();
      const data = encoder.encode(codeVerifier);
      const digest = await window.crypto.subtle.digest("SHA-256", data);

      return base64encode(digest);
    };

    let codeVerifier = generateRandomString(128);

    await generateCodeChallenge(codeVerifier).then((codeChallenge) => {
      let state = generateRandomString(16);
      let scope = "playlist-modify-private";

      localStorage.setItem("code_verifier", codeVerifier);

      let args = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        scope: scope,
        redirect_uri: redirectUri,
        state: state,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
      });

      window.location.replace(`${AUTHORIZE}?${args}`);
    });
  };
  const getToken = async (token) => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");

    if (code && !token) {
      let codeVerifier = localStorage.getItem("code_verifier");

      let body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier,
      });

      await axios
        .post("https://accounts.spotify.com/api/token", body, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          setToken(response.data.access_token);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };
  const handleSearch = () => {
    axios
      .get(
        `${"https://api.spotify.com/v1/search"}?q=${searchQuery}&type=track`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setSearchResults(response.data.tracks.items);
      })
      .catch((error) => {
        console.error("Error searching tracks:", error);
      });
  };

  const addToPlaylist = (params) => {
    setPlayList([...playList, params]);
  };
  const handleLogin = () => {
    login();
    setIsLogin(true);
  };
  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("code_verifier");
    setIsLogin(false);
  };
  useEffect(() => {
    getToken(token);
    if (token !== "") setIsLogin(true);
  });

  return (
    <>
      {isLogin === false ? (
        <button className="btn btn-info" onClick={handleLogin}>
          login
        </button>
      ) : (
        <>
          <button className="btn btn-danger" onClick={handleLogout}>
            logout
          </button>
          <Playlist songs={playList} setPlayList={setPlayList} />
          <MostPlayed
            songs={seachResults}
            tambahLagu={addToPlaylist}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleSearch={handleSearch}
          />
        </>
      )}
    </>
  );
}

export default Spotify;
