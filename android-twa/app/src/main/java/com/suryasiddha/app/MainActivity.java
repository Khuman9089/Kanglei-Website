package com.suryasiddha.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import java.io.InputStream;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private ProgressBar progressBar;
    private long backPressedTime = 0;
    private Toast exitToast;

    @Override
    @SuppressLint("SetJavaScriptEnabled")
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Native Top Status Bar & Bottom Navigation Bar Tint matching #0B0F19
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(ContextCompat.getColor(this, R.color.statusBarColor));
        window.setNavigationBarColor(ContextCompat.getColor(this, R.color.navigationColor));

        WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
        if (insetsController != null) {
            insetsController.setAppearanceLightStatusBars(false); // Crisp white icons on dark status bar
            insetsController.setAppearanceLightNavigationBars(false);
        }

        setContentView(R.layout.activity_main);

        // Prevent status bar and bottom nav bar from mixing up / overlapping content
        View rootLayout = findViewById(R.id.rootLayout);
        if (rootLayout != null) {
            ViewCompat.setOnApplyWindowInsetsListener(rootLayout, (v, windowInsets) -> {
                Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(insets.left, insets.top, insets.right, insets.bottom);
                return WindowInsetsCompat.CONSUMED;
            });
        }

        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);

        // Native Asset Loader - Loads files directly from APK package memory
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/suryasiddha/", new WebViewAssetLoader.AssetsPathHandler(this))
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUserAgentString(settings.getUserAgentString() + " SuryaSiddhaApp/1.0");

        webView.setVerticalScrollBarEnabled(true);
        webView.setOverScrollMode(View.OVER_SCROLL_IF_CONTENT_SCROLLS);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.setBackgroundColor(ContextCompat.getColor(this, R.color.backgroundColor));

        // Android Javascript Interface for Web-to-Native Ad & App Controls
        webView.addJavascriptInterface(new Object() {
            @android.webkit.JavascriptInterface
            public void showAdMobBanner(boolean show, String adUnitId) {
                android.util.Log.d("SuryaSiddhaAdMob", "showAdMobBanner: " + show + ", unit: " + adUnitId);
            }

            @android.webkit.JavascriptInterface
            public void showAdMobInterstitial(String adUnitId) {
                android.util.Log.d("SuryaSiddhaAdMob", "showAdMobInterstitial: " + adUnitId);
            }
        }, "AndroidBridge");

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                String host = uri.getHost();

                // Allow external network API, ads, and CDN image requests to bypass local asset interceptor
                if (host != null && !host.equals("appassets.androidplatform.net")) {
                    return super.shouldInterceptRequest(view, request);
                }

                String path = uri.getPath();

                // 1. Intercept root/directory request and serve local index.html
                if (path != null && (path.equals("/suryasiddha") || path.equals("/suryasiddha/"))) {
                    try {
                        return new WebResourceResponse("text/html", "UTF-8", getAssets().open("index.html"));
                    } catch (Exception ignored) {}
                }

                // 2. Delegate to WebViewAssetLoader
                WebResourceResponse response = assetLoader.shouldInterceptRequest(uri);
                if (response != null) {
                    return response;
                }

                // 3. Fallback direct asset lookup for complete offline resilience
                if (path != null) {
                    String cleanPath = path;
                    if (cleanPath.startsWith("/suryasiddha/")) {
                        cleanPath = cleanPath.substring("/suryasiddha/".length());
                    } else if (cleanPath.startsWith("/")) {
                        cleanPath = cleanPath.substring(1);
                    }
                    try {
                        String mimeType = "application/octet-stream";
                        if (cleanPath.endsWith(".html")) mimeType = "text/html";
                        else if (cleanPath.endsWith(".js")) mimeType = "application/javascript";
                        else if (cleanPath.endsWith(".css")) mimeType = "text/css";
                        else if (cleanPath.endsWith(".json") || cleanPath.endsWith(".webmanifest")) mimeType = "application/json";
                        else if (cleanPath.endsWith(".png")) mimeType = "image/png";
                        else if (cleanPath.endsWith(".svg")) mimeType = "image/svg+xml";

                        InputStream is = getAssets().open(cleanPath);
                        return new WebResourceResponse(mimeType, "UTF-8", is);
                    } catch (Exception ignored) {}
                }

                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // Stay inside native standalone app view
                if (url.startsWith("https://appassets.androidplatform.net") || url.contains("suryasiddha")) {
                    return false;
                }
                // Only external URLs (e.g. WhatsApp, phone dialer, external website) launch outside
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // If offline and a non-critical background fetch fails, do not show web error page
                if (!request.isForMainFrame()) {
                    return;
                }
                super.onReceivedError(view, request, error);
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });

        // Handle phone back button: navigate history, or confirm before exiting
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    if (backPressedTime + 2000 > System.currentTimeMillis()) {
                        if (exitToast != null) {
                            exitToast.cancel();
                        }
                        finish();
                    } else {
                        exitToast = Toast.makeText(MainActivity.this, "Press back again to exit", Toast.LENGTH_SHORT);
                        exitToast.show();
                        backPressedTime = System.currentTimeMillis();
                    }
                }
            }
        });

        // Load self-contained local app bundle
        webView.loadUrl("https://appassets.androidplatform.net/suryasiddha/index.html");
    }
}

