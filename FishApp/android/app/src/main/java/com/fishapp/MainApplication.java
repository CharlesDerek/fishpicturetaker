package com.fishapp;

import android.app.Application;

import com.amazonaws.RNAWSCognitoPackage;
import com.facebook.react.ReactApplication;
import com.devialab.exif.RCTExifPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnfs.RNFSPackage;
import com.rngrp.RNGRPPackage;

import java.util.Arrays;
import java.util.List;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RCTExifPackage(),
            new RNDeviceInfo(),
          new ImagePickerPackage(),
          new ImageResizerPackage(),
          new RNAWSCognitoPackage(),
          new VectorIconsPackage(),
          new RNFSPackage(),
          new RNFirebasePackage(),
          new RNFirebaseAnalyticsPackage(),
          new RNFirebaseCrashlyticsPackage(),
          new RNGRPPackage(),
          new FishpicPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
