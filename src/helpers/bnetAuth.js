function storeBnetToken(bnetToken) {
  window.localStorage.setItem("bnetToken", bnetToken);
}

function getStoredBnetToken() {
  return window.localStorage.getItem("bnetToken");
}

function getCodeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("code");
}

function removeCodeFromHistory() {
  window.history.replaceState(null, "", "/");
}

async function getFreshBnetToken(code, redirectUri) {
  const body = new FormData();
  body.append("code", code);
  body.append("redirectUri", redirectUri);
  if (process.env.NODE_ENV === "development") body.append("dev", true);
  const res = await fetch("/api/bnet-auth", { method: "POST", body });

  const { bnetToken } = await res.json();
  storeBnetToken(bnetToken);
  return bnetToken;
}

async function getBnetIdentity(bnetToken) {
  const res = await fetch("https://us.api.battle.net/account/user", {
    headers: { Authorization: `Bearer ${bnetToken}` }
  });
  if (res.ok) {
    return await res.json();
  } else {
    return null;
  }
}

async function restoreBnetAuth() {
  const bnetToken = getStoredBnetToken();
  if (bnetToken == null) {
    return null;
  }
  const bnetIdentity = await getBnetIdentity(bnetToken);
  return { bnetToken, bnetIdentity };
}

export async function performBnetAuth() {
  const bnetAuth = await restoreBnetAuth();

  if (bnetAuth != null) {
    return bnetAuth;
  }

  const code = getCodeFromUrl();
  if (code != null) {
    const bnetToken = await getFreshBnetToken(
      code,
      process.env.REACT_APP_BATTLE_NET_REDIRECT_URI
    );
    storeBnetToken(bnetToken);

    // at this point, we consider the code used, so let's remove it from the
    // browser's location bar, so we don't try to use it again at page refresh
    removeCodeFromHistory();

    const bnetIdentity = await getBnetIdentity(bnetToken);

    return { bnetToken, bnetIdentity };
  }
}
