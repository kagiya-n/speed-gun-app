# Google Play Store デプロイガイド

## 前提条件

1. **Android Studio** がインストールされていること
2. **Java Development Kit (JDK)** がインストールされていること
3. **Google Play Console** アカウントがあること
4. **PWAがHTTPS対応のドメインでホストされていること**

## 手順

### 1. ドメインの設定

`android/app/src/main/res/values/strings.xml` ファイルで、`your-domain.com` を実際のドメインに変更してください。

```xml
<string name="twa_url">https://yourdomain.com</string>
<string name="fallback_url">https://yourdomain.com</string>
```

`android/app/src/main/AndroidManifest.xml` も同様に更新：

```xml
<data android:scheme="https" android:host="yourdomain.com" />
```

### 2. アプリ署名

キーストアファイルを作成：

```bash
cd android
keytool -genkey -v -keystore speedgun-release-key.keystore -alias speedgun -keyalg RSA -keysize 2048 -validity 10000
```

`android/app/build.gradle` に署名設定を追加：

```gradle
android {
    signingConfigs {
        release {
            storeFile file('../speedgun-release-key.keystore')
            storePassword 'your-store-password'
            keyAlias 'speedgun'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

### 3. APKビルド

```bash
cd android
./gradlew assembleRelease
```

APKファイルは `android/app/build/outputs/apk/release/` にあります。

### 4. Digital Asset Links

ドメインのルートに `.well-known/assetlinks.json` ファイルを配置：

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.speedgun.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

SHA256フィンガープリントを取得：

```bash
keytool -list -v -keystore speedgun-release-key.keystore -alias speedgun
```

### 5. Google Play Console

1. [Google Play Console](https://play.google.com/console) にログイン
2. 「アプリを作成」をクリック
3. 必要な情報を入力
4. APKファイルをアップロード
5. ストアの掲載情報を入力
6. 審査に提出

## 注意点

- PWAは必ずHTTPS対応が必要
- Digital Asset Linksの設定が正しくないと、アプリがWebビューで開かない
- 初回リリースには数日から1週間の審査期間が必要