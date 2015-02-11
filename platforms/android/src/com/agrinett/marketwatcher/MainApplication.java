package com.agrinett.marketwatcher;  //REPLACE THIS WITH YOUR package name

import android.app.Application;
import com.parse.Parse;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Parse.initialize(this, "ZEYEsAFRRgxjy0BXX1d5BJ2xkdJtsjt8irLTEnYJ", "zLFVgMOZVwxC3IsSKCCgsnL2yEe1IrSRxitas2kb");
        //ParseInstallation.getCurrentInstallation().saveInBackground();
    }
}