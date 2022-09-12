package expo.modules.updates.loader

import android.content.Context
import android.net.Uri
import androidx.test.internal.runner.junit4.AndroidJUnit4ClassRunner
import androidx.test.platform.app.InstrumentationRegistry
import expo.modules.updates.UpdatesConfiguration
import expo.modules.updates.db.entity.AssetEntity
import io.mockk.every
import io.mockk.mockk
import okhttp3.*
import org.json.JSONException
import org.json.JSONObject
import org.junit.Assert
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File
import java.util.*

@RunWith(AndroidJUnit4ClassRunner::class)
class FileDownloaderTest {
  private lateinit var context: Context

  @Before
  fun setup() {
    context = InstrumentationRegistry.getInstrumentation().targetContext
  }

  @Test
  fun testCacheControl_LegacyManifest() {
    val configMap = mapOf<String, Any>(
      "updateUrl" to Uri.parse("https://exp.host/@test/test"),
      "runtimeVersion" to "1.0",
      "usesLegacyManifest" to true
    )
    val config = UpdatesConfiguration(null, configMap)
    val actual = FileDownloader.createRequestForManifest(config, null, context)
    Assert.assertNull(actual.header("Cache-Control"))
  }

  @Test
  fun testCacheControl_NewManifest() {
    val configMap = mapOf<String, Any>(
      "updateUrl" to Uri.parse("https://u.expo.dev/00000000-0000-0000-0000-000000000000"),
      "runtimeVersion" to "1.0",
      "usesLegacyManifest" to false
    )
    val config = UpdatesConfiguration(null, configMap)
    val actual = FileDownloader.createRequestForManifest(config, null, context)
    Assert.assertNull(actual.header("Cache-Control"))
  }

  @Test
  @Throws(JSONException::class)
  fun testExtraHeaders_ObjectTypes() {
    val configMap = mapOf<String, Any>(
      "updateUrl" to Uri.parse("https://u.expo.dev/00000000-0000-0000-0000-000000000000"),
      "runtimeVersion" to "1.0",

    )
    val config = UpdatesConfiguration(null, configMap)
    val extraHeaders = JSONObject().apply {
      put("expo-string", "test")
      put("expo-number", 47.5)
      put("expo-boolean", true)
    }

    val actual = FileDownloader.createRequestForManifest(config, extraHeaders, context)
    Assert.assertEquals("test", actual.header("expo-string"))
    Assert.assertEquals("47.5", actual.header("expo-number"))
    Assert.assertEquals("true", actual.header("expo-boolean"))
  }

  @Test
  @Throws(JSONException::class)
  fun testExtraHeaders_OverrideOrder() {
    // custom headers configured at build-time should be able to override preset headers
    val headersMap = mapOf("expo-updates-environment" to "custom")
    val configMap = mapOf<String, Any>(
      "updateUrl" to Uri.parse("https://u.expo.dev/00000000-0000-0000-0000-000000000000"),
      "runtimeVersion" to "1.0",
      "requestHeaders" to headersMap
    )

    val config = UpdatesConfiguration(null, configMap)

    // serverDefinedHeaders should not be able to override preset headers
    val extraHeaders = JSONObject()
    extraHeaders.put("expo-platform", "ios")

    val actual = FileDownloader.createRequestForManifest(config, extraHeaders, context)
    Assert.assertEquals("android", actual.header("expo-platform"))
    Assert.assertEquals("custom", actual.header("expo-updates-environment"))
  }

  @Test
  @Throws(JSONException::class)
  fun testAssetExtraHeaders_OverrideOrder() {
    // custom headers configured at build-time should be able to override preset headers
    val headersMap = mapOf("expo-updates-environment" to "custom")
    val configMap = mapOf<String, Any>(
      "updateUrl" to Uri.parse("https://u.expo.dev/00000000-0000-0000-0000-000000000000"),
      "runtimeVersion" to "1.0",
      "requestHeaders" to headersMap
    )

    val config = UpdatesConfiguration(null, configMap)

    val assetEntity = AssetEntity("test", "jpg").apply {
      url = Uri.parse("https://example.com")
      extraRequestHeaders = JSONObject().apply { put("expo-platform", "ios") }
    }

    // assetRequestHeaders should not be able to override preset headers
    val actual = FileDownloader.createRequestForAsset(assetEntity, config)
    Assert.assertEquals("android", actual.header("expo-platform"))
    Assert.assertEquals("custom", actual.header("expo-updates-environment"))
  }

  @Test
  fun test_downloadAsset_mismatchedAssetHash() {
    val configMap = mapOf<String, Any>(
      UpdatesConfiguration.UPDATES_CONFIGURATION_UPDATE_URL_KEY to Uri.parse("https://u.expo.dev/00000000-0000-0000-0000-000000000000"),
      UpdatesConfiguration.UPDATES_CONFIGURATION_RUNTIME_VERSION_KEY to "1.0",
    )

    val config = UpdatesConfiguration(null, configMap)

    val assetEntity = AssetEntity(UUID.randomUUID().toString(), "jpg").apply {
      url = Uri.parse("https://example.com")
      extraRequestHeaders = JSONObject().apply { put("expo-platform", "ios") }
      expectedHash = "badhash"
    }

    val client = mockk<OkHttpClient>() {
      every { newCall(any()) } returns mockk {
        every { enqueue(any()) } answers {
          firstArg<Callback>().onResponse(
            mockk(),
            mockk {
              every { isSuccessful } returns true
              every { body() } returns ResponseBody.create(MediaType.parse("text/plain; charset=utf-8"), "hello")
            }
          )
        }
      }
    }

    var error: Exception? = null
    var didSucceed = false

    FileDownloader(client).downloadAsset(
      assetEntity, File(context.cacheDir, "test"), config,
      object : FileDownloader.AssetDownloadCallback {
        override fun onFailure(e: Exception, assetEntity: AssetEntity) {
          error = e
        }

        override fun onSuccess(assetEntity: AssetEntity, isNew: Boolean) {
          didSucceed = true
        }
      }
    )

    Assert.assertTrue(error!!.message!!.contains("Asset hash invalid"))
    Assert.assertFalse(didSucceed)
  }
}
