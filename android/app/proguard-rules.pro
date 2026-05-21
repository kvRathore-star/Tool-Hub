# Capacitor Web Bridge Exemptions
-keep class com.getcapacitor.** { *; }
-keep class org.apache.cordova.** { *; }
-keep public class * extends com.getcapacitor.Plugin

# Keep Javascript interfaces for Webview
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Androidx exclusions
-keep class androidx.appcompat.widget.** { *; }
