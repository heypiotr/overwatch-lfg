// https://github.com/facebook/create-react-app/issues/3734#issuecomment-377917693
// import SyncClient from "twilio-sync";
const SyncClient = global.Twilio.Sync.Client;

function storeSyncToken(syncToken) {
  window.localStorage.setItem("syncToken", JSON.stringify(syncToken));
}

function getStoredSyncToken() {
  const storedSyncToken = window.localStorage.getItem("syncToken");
  if (storedSyncToken) {
    return JSON.parse(storedSyncToken);
  }
  return null;
}

async function getFreshSyncToken() {
  const res = await fetch("/api/sync-token");
  const { syncToken } = await res.json();
  storeSyncToken(syncToken);
  return syncToken;
}

async function getStoredOrFreshSyncToken() {
  const syncToken = getStoredSyncToken();
  if (syncToken != null) {
    return syncToken;
  }
  return await getFreshSyncToken();
}

export function setupSyncClient() {
  return new Promise(async (resolve, reject) => {
    const syncToken = await getStoredOrFreshSyncToken();
    const syncClient = new SyncClient(syncToken);

    const refreshToken = async () => {
      const syncToken = await getFreshSyncToken();
      syncClient.updateToken(syncToken);
    };
    syncClient.on("tokenAboutToExpire", refreshToken);
    syncClient.on("tokenExpired", refreshToken);

    syncClient.on("connectionStateChanged", newState => {
      if (newState === "connected") {
        resolve(syncClient);
      } else if (newState === "error") {
        reject();
      }
    });
  });
}

export function forEachItem(mapOrList, forEachCallback) {
  return new Promise((resolve, reject) => {
    const pageHandler = paginator => {
      paginator.items.forEach(item => {
        forEachCallback(item);
      });
      return paginator.hasNextPage
        ? paginator.nextPage().then(pageHandler)
        : resolve();
    };
    mapOrList.getItems().then(pageHandler);
  });
}

export function updateOwnPlayer(bnetToken, newPlayerData) {
  fetch("/api/update-own-player", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bnetToken, newPlayerData })
  });
}
