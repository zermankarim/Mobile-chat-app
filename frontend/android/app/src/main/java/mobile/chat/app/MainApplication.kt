package mobile.chat.app

import android.app.Application
import com.facebook.react.ReactApplication
import com.facebook.react.ReactNativeHost
import com.facebook.react.ReactInstanceManager
import com.facebook.react.ReactPackage
import com.facebook.soloader.SoLoader
import expo.modules.adapters.react.ReactNativeHostWrapper
import expo.modules.core.interfaces.ReactNativeHostInterface
import com.reactnativemmkv.MMKV
import com.reactnativemmkv.MMKVPackage

class MainApplication : Application(), ReactApplication {

    private val mReactNativeHost = object : ReactNativeHost(this) {
        override fun getPackages(): List<ReactPackage> {
            return listOf(
                // Add your packages here
                MMKVPackage()
            )
        }

        override fun getUseDeveloperSupport(): Boolean {
            return BuildConfig.DEBUG
        }

        override fun getReactNativeHost(): ReactNativeHost {
            return this
        }
    }

    override fun getReactNativeHost(): ReactNativeHost {
        return mReactNativeHost
    }

    override fun onCreate() {
        super.onCreate()
        SoLoader.init(this, /* native exopackage */ false)
        // Initialize MMKV if needed
        MMKV.initialize(this)
    }
}