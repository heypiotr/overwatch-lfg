# Overwatch LFG

A public catalog of Overwatch players looking for a group, or looking to fill their own group.

And, perhaps more interestingly, an example of how to build a web app with Twilio Sync. If you're looking to build your own web app with Twilio Sync, hopefully there's some interesting knowledge in here!

See it in action on: <https://overwatch-lfg.herokuapp.com>

## How it works

There's 4 actors involved:

1. A frontend React app.

2. A [Battle.net OAuth][bo] service, to confirm the identity of the player that wants to list themselves in the catalog.

3. A [Twilio Sync][ts] service, where the catalog itself is hosted. Twilio Sync allows us to get real-time updates about changes in the catalog.

4. A few backend functions, hosted as [Twilio Functions][tf].

   - (a) `sync-token` issues _Sync Client access tokens_, which grant the site's users read-only access to the catalog. The tokens are signed with a Twilio secret, hence this is a backend function.

   - (b) `bnet-auth` exchanges Battle.net OAuth codes for _Battle.net access tokens_. This process requires knowing the _Battle.net client secret_, hence this is a backend function.

     If you're not familiar with OAuth authorization codes, here's a great read: [What is the OAuth 2.0 Authorization Code Grant Type?][oa]

   - (c) `update-own-player` updates the catalog via Twilio Sync. This requires knowing a secret _Twilio auth token_, which grants write access to the Twilio Sync service, hence this is a backend function.

     An important role of this function is also to ensure that users can only update their own data in the catalog. To do that, it requires you to provide it with your _Battle.net access token_. It then uses it to fetch/verify your Battle.net user ID, and will only update the data of that user.

[tf]: https://www.twilio.com/docs/runtime/functions
[ts]: https://www.twilio.com/sync
[bo]: https://dev.battle.net/docs/read/oauth
[oa]: https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type

##### Use Case 1: Reading the catalog

The frontend app (1) uses the `sync-token` (4a) endpoint to get a _Sync Client access token_, and access the catalog on Twilio Sync (3). If you only want to browse what groups are available to join, or what players are available to invite to your own group, this is pretty much it!

##### Use Case 2: Listing yourself in the catalog

If you want to list yourself on the catalog, you'll click the "Log in with Battle.net" button, initiating the Battle.net OAuth (2) authorization process. You'll be redirected to the Battle.net page, log in with your credentials, allow "Overwatch LFG" to access your profile, and get redirected back to the site with an OAuth code.

The frontend app (1) will take the code and use the `bnet-auth` (4b) function to exchange it for a _Battle.net access token_. From now on, the frontend app (1) can use the token with the `update-own-player` (4c) function, in order to add/update/remove your data from the catalog.

## How it's secured: Sync ACLs and backends

(Preliminary read: <https://www.twilio.com/docs/sync/permissions-and-access-control>)

We want everyone to be able to read the catalog, but only be able to update their own data in the catalog. It's done via a combination of Sync ACLs and a backend gatekeeper:

- The "players" map hosted on Sync has a "Read" permission set for the "guest" identity. No "Write" and "Manage" permissions.

  <https://www.twilio.com/docs/sync/api/permissions#setting-or-updating-permissions>

- The `sync-token` function which generates the Sync tokens for the frontend app, generates them with a "guest" identity.

  Combined with the above, this means that every user/client coming to the frontend app gains immediate "Read" access to the catalog.

- The frontend app however can't write to the catalog directly. Instead, it has to go through the backend `update-own-player` function, which validates the user's Battle.net identity (by requiring a valid Battle.net access token), and ensures that they can only update their own data. It does some basic validation of the data, too (which is always a good idea).

  The `update-own-player` function authenticates with the Sync REST API via "root" credentials (the Twilio Auth Token), and so it has full write/manage access to the Sync service, and uses it to update the catalog on behalf of the user.

## How it's hosted: using Twilio Functions in frontend apps

This app has no backend of its own, so in theory at least, it could be hosted anywhere as a bunch of static HTML/JS/CSS files.

However … for good security reasons, web browsers won't just allow an "my-website.com" website to access anything that's not "overwatch-lfg.com". And since the backend functions are hosted on Twilio Functions, they're at "something-something.twil.io" address.

Now, there are ways for "something-something.twil.io" to say, "you know what, I'm actually okay with overwatch-lfg.com to access me." That's known as [Cross-Origin Resource Sharing][cors], and it's a pretty good/important read if you're not yet familiar with it.

[cors]: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

Another relatively common solution is to have the web browser call "my-website.com/backend-endpoint", and set it up so that the "my-website.com" server "forwards" (proxies) the request to "something-something.twil.io/backend-endpoint". This way, the web browser always operates on the "my-website.com". The downside is, you do actually need some simple backend on "my-website.com" that'll do the forwarding/proxying.

This app uses the second solution. It's hosted as a simple Heroku app, which serves both the static frontend files, and is set up to proxy the backend requests to Twilio Functions. Specifically—if you know a bit more about Heroku—it uses the [Heroku Buildpack for create-react-app][hb].

[hb]: https://github.com/mars/create-react-app-buildpack

## How to run a local dev environment

Clone the repo, run `npm install` and `HTTPS=true npm start`. That's it! (Make sure the app is running on port 3000, because the Battle.net OAuth is set to redirect to "https://localhost:3000".)

Note: by default, it'll connect to the "production" Twilio Sync service. If you log in to Battle.net and add yourself to the catalog, you'll actually be adding yourself to the live version too :wink:.

### Setting up your own Twilio environment

(Note: it might be a good idea to create a separate Twilio project for this.)

1. Set up your own Sync service:

   - go to <https://www.twilio.com/console/sync/services>
   - add a new service, or if you want to use the default one, note down it's SID
   - make sure the service has "ACL enabled"

2. Create the `players` map and grant Read access to "guest" (a role we use in `sync-token` when issuing the Sync tokens). The easiest way to do that is via `curl`, so open up your terminal:

   ```
   ACCOUNT_SID=ACxxx
   AUTH_TOKEN=xxx
   SYNC_SERVICE_SID=default
   curl -u $ACCOUNT_SID:$AUTH_TOKEN \
       -X POST https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/players
   curl -u $ACCOUNT_SID:$AUTH_TOKEN \
       https://sync.twilio.com/v1/Services/$SYNC_SERVICE_SID/Maps/players/Permissions/guest \
       -d Read=true -d Write=false -d Manage=false
   ```

3. Set up an API key used for signing the Sync tokens:

   - go to <https://www.twilio.com/console/runtime/api-keys>
   - create a new key, and note down its SID and the secret

4. Set up env variables for Twilio Functions:

   - go to <https://www.twilio.com/console/runtime/functions/configure>
   - check the "Enable ACCOUNT_SID and AUTH_TOKEN"
   - add `SYNC_SERVICE_SID` and set it to the Sync service's SID
   - add `TWILIO_API_KEY` and set it to the API key's SID
   - add `TWILIO_API_SECRET` and set it to the API key's secret

5. Set up the Twilio Functions:

  - go to <https://www.twilio.com/console/runtime/functions/manage>
  - add `sync-token` and `update-own-player` functions
  - the source code for these is in the "twilio-functions" directory in this repo

You now have your own Sync/Functions set up that you have full access to, and that is separate from the default one.

The only remaining step is to point your local frontend app to use it:

  - In "package.json", find the "/api" proxy setup, and change its "target" to your own Twilio Runtime domain.
  - You'll find it on: <https://www.twilio.com/console/runtime/overview>
  - Do not change the "/api/bnet-auth" setup, unless you've also set up your own Battle.net OAuth app and configured your own `bnet-auth` Twilio Function.

### Other local tools w/ backend privileges

If you set up your own environment per the instructions above, you can copy the ".env-backend.example" to ".env-backend", and fill it in with your secrets. This will allow you to:

- Use the `admin-players.js` script to add/remove players in the catalog via a command line. Great for testing the frontend app without actually having to create multiple Battle.net accounts.

  - example: add or update player data in the catalog:<br>
    `node admin-players.js upsert 123 "Me#1234" "torb main" "Competetive" "group"`

  - example: remove player from the catalog:<br>
    `node admin-players.js remove 123`

- Run the Twilio Functions locally, via the ".local.js" scripts. Great for testing the Twilio Function's code in a local environment, with access to the debugger.

  - `cd twilio-functions`

  - `nvm install 6.10`, `nvm use 6.10`
    - Twilio Functions run on Node.js 6.10, so it's best to test with the same version.

  - `npm install`
    - This installs the Node.js packages used by the Twilio Functions.
    - Note that this is different from the packages used by the frontend React app, which are in the root package.json and node_modules.

  - You can now run the function like this:

    ```
    node sync-token.local.js

    node update-own-player.local.js <Battle.net token> \
    '{"battletag": "Me#1234", "desc": "d.va", "playmode": "Quick Play", "lookingFor": "group"}'
    ```

    You can get your <Battle.net token> by logging in via the frontend app, and then accessing the `bnetToken` item from the browser's local storage—e.g., by running this JavaScript in the browser's dev console:

    ```
    localStorage.getItem("bnetToken")
    ```
