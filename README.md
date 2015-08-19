# AgrinettMarketWatcher-Mobile

Using bower to manage js library dependencies


## Commands to build the system
bower install (to install the js libraries)
ionic state restore (To install the required cordova plugins and platforms)

add the parse plugin using the following command

cordova plugin add https://github.com/benjie/phonegap-parse-plugin --variable APP_ID=PARSE_APP_ID --variable CLIENT_KEY=PARSE_CLIENT_KEY


(ensure that you replace the parse_app_id and parse_client_key with the information specific to your installation)

## Plugins needed as of 19/08/15
1. Device
2. Console
3. Whitelist
4. Splashscreen
5. Dialogs
6. InAppBrowser
7. phonegap-parse-plugin