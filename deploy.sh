#!/bin/bash 

if [ -f "./agriprice.apk" ] then
	echo "Found existing apk ... removing"
	rm *.apk
fi


echo "Attempting to Build Deployable APK for AgriPrice"
cordova build --release android

APK_PATH="./platforms/android/build/outputs/apk/android-release-unsigned.apk"
echo "APK Generated at: $APK_PATH"

echo "Moving the apk to current directory to make process easier"
mv $APK_PATH ./agriprice-unsigned.apk

echo "Signing the APK using the keystore"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore agriprice.keystore agriprice-unsigned.apk alias_name

echo "Compress the APK for upload"
zipalign -v 4 agriprice-unsigned.apk agriprice.apk