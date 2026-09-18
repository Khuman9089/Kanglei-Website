// scripts/init-twa-project.js - Sets up Android TWA Project for SuryaSiddha
const fs = require('fs');
const path = require('path');

const twaDir = path.resolve(__dirname, '../android-twa');
const appDir = path.join(twaDir, 'app');
const srcDir = path.join(appDir, 'src/main');
const resDir = path.join(srcDir, 'res');

// Ensure directories exist
[
  twaDir,
  appDir,
  srcDir,
  resDir,
  path.join(resDir, 'values'),
  path.join(resDir, 'xml'),
  path.join(resDir, 'drawable'),
  path.join(resDir, 'mipmap-hdpi'),
  path.join(resDir, 'mipmap-mdpi'),
  path.join(resDir, 'mipmap-xhdpi'),
  path.join(resDir, 'mipmap-xxhdpi'),
  path.join(resDir, 'mipmap-xxxhdpi'),
].forEach((d) => fs.mkdirSync(d, { recursive: true }));

// 1. root build.gradle
fs.writeFileSync(
  path.join(twaDir, 'build.gradle'),
  `// Top-level build file
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`
);

// 2. settings.gradle
fs.writeFileSync(
  path.join(twaDir, 'settings.gradle'),
  `include ':app'
rootProject.name = "SuryaSiddha"
`
);

// 3. app/build.gradle
fs.writeFileSync(
  path.join(appDir, 'build.gradle'),
  `plugins {
    id 'com.android.application'
}

android {
    namespace 'in.kuthiyengpham.suryasiddha'
    compileSdk 34

    defaultConfig {
        applicationId "in.kuthiyengpham.suryasiddha"
        minSdk 21
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        
        manifestPlaceholders = [
            hostName: "kuthiyengpham.in",
            defaultUrl: "https://kuthiyengpham.in/suryasiddha/",
            launcherName: "SuryaSiddha",
            assetStatements: '[{ \\"relation\\": [\\"delegate_permission/common.handle_all_urls\\"], \\"target\\": {\\"namespace\\": \\"android_app\\", \\"package_name\\": \\"in.kuthiyengpham.suryasiddha\\", \\"sha256_cert_fingerprints\\": [\\"14:6D:E9:7D:0F:52:AB:E0:5C:4E:9B:4C:6D:88:83:B3:36:2D:42:01:DF:7B:6A:57:9A:9E:C1:92:43:08:4C:E6\\"]}}]'
        ]
    }

    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
}

dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
    implementation 'androidx.browser:browser:1.8.0'
}
`
);

// 4. AndroidManifest.xml
fs.writeFileSync(
  path.join(srcDir, 'AndroidManifest.xml'),
  `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher"
        android:supportsRtl="true"
        android:theme="@style/Theme.SuryaSiddha">

        <meta-data
            android:name="asset_statements"
            android:value="\${assetStatements}" />

        <activity
            android:name="com.google.androidbrowserhelper.trusted.LauncherActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:screenOrientation="portrait">

            <meta-data
                android:name="android.support.customtabs.trusted.DEFAULT_URL"
                android:value="\${defaultUrl}" />

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="https"
                    android:host="\${hostName}"
                    android:pathPrefix="/suryasiddha" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`
);

// 5. strings.xml & colors.xml & styles.xml
fs.writeFileSync(
  path.join(resDir, 'values/strings.xml'),
  `<resources>
    <string name="app_name">SuryaSiddha</string>
</resources>
`
);

fs.writeFileSync(
  path.join(resDir, 'values/colors.xml'),
  `<resources>
    <color name="colorPrimary">#D97706</color>
    <color name="colorPrimaryDark">#0F172A</color>
    <color name="colorAccent">#F59E0B</color>
    <color name="navigationColor">#0F172A</color>
    <color name="backgroundColor">#FAF7F2</color>
</resources>
`
);

fs.writeFileSync(
  path.join(resDir, 'values/styles.xml'),
  `<resources>
    <style name="Theme.SuryaSiddha" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/colorPrimary</item>
        <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
        <item name="colorAccent">@color/colorAccent</item>
        <item name="android:navigationBarColor">@color/navigationColor</item>
        <item name="android:statusBarColor">@color/colorPrimaryDark</item>
    </style>
</resources>
`
);

// 6. Copy PNG icon to ic_launcher
const iconSrc = path.resolve(__dirname, '../public/suryasiddha/icons/icon-512.png');
if (fs.existsSync(iconSrc)) {
  ['mipmap-hdpi', 'mipmap-mdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi'].forEach((m) => {
    fs.copyFileSync(iconSrc, path.join(resDir, m, 'ic_launcher.png'));
  });
}

console.log('SuryaSiddha Android TWA Project successfully created in android-twa/!');
