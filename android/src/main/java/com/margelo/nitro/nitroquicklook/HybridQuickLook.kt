package com.margelo.nitro.nitroquicklook

import androidx.annotation.Keep
import com.facebook.proguard.annotations.DoNotStrip
import com.facebook.react.bridge.ReactApplicationContext
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise

@Keep
@DoNotStrip
class HybridQuickLook : HybridQuickLookSpec() {
  private val context: ReactApplicationContext
    get() = NitroModules.applicationContext ?: throw Error("No ApplicationContext set!")

  override fun previewFile(options: PreviewFileOptions): Promise<Unit> =
    Promise.parallel {
      val file = FileResolver.resolve(context, options.uri, options.requestOptions?.headers)
      context.startPreview(file, options.chooserTitle)
    }

  override fun previewFiles(options: PreviewFilesOptions): Promise<Unit> =
    Promise.rejected(UnsupportedOperationException("previewFiles is not supported on Android"))

  override fun canPreview(uri: String): Promise<Boolean> =
    Promise.parallel {
      val mimeType = QuickLookMimeTypes.forPath(uri)
      mimeType != null && context.canHandleView(mimeType)
    }

  override fun generateThumbnail(options: ThumbnailOptions): Promise<ThumbnailResult> =
    Promise.rejected(UnsupportedOperationException("generateThumbnail is not supported on Android"))

  override fun setOnWillDismiss(callback: (() -> Unit)?) = Unit

  override fun setOnDismiss(callback: (() -> Unit)?) = Unit

  override fun setOnEditedFile(callback: ((event: EditedFileEvent) -> Unit)?) = Unit

  override fun setOnSavedEditedCopy(callback: ((event: SavedEditedCopyEvent) -> Unit)?) = Unit
}
