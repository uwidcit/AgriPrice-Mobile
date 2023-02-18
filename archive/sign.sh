#!/bin/bash
 cordova build --release android
 cp platforms/android/build/outputs/apk/android-release-unsigned.apk ./agriprice-unsigned.apk
 jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore agriprice.keystore agriprice-unsigned.apk alias_name
 zipalign -v 4 agriprice-unsigned.apk agriprice.apk