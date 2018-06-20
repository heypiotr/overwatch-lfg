import React from "react";
import "./Login.css";

function Login() {
  const url = `https://us.battle.net/oauth/authorize?client_id=${
    process.env.REACT_APP_BATTLE_NET_CLIENT_ID
  }&redirect_uri=${
    process.env.REACT_APP_BATTLE_NET_REDIRECT_URI
  }&response_type=code`;

  const loginButton = (
    <a href={url} className="Login-button">
      Log in with Battle.net
    </a>
  );

  return <div className="Login">{loginButton}</div>;
}

export default Login;
