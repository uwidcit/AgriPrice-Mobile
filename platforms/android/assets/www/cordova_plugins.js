cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.core.ParsePlugin/www/cdv-plugin-parse.js",
        "id": "org.apache.cordova.core.ParsePlugin.ParsePlugin",
        "clobbers": [
            "window.parsePlugin"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.console": "0.2.8",
    "org.apache.cordova.core.ParsePlugin": "0.2.0",
    "org.apache.cordova.device": "0.2.9",
    "org.apache.cordova.inappbrowser": "0.5.5-dev"
}
// BOTTOM OF METADATA
});