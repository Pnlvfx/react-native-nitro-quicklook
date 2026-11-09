package com.margelo.nitro.nitroquicklook

import android.content.Intent
import androidx.core.content.FileProvider
import com.facebook.react.bridge.ReactApplicationContext
import java.io.File

internal fun ReactApplicationContext.startPreview(file: File, chooserTitle: String?) {
  val uri = FileProvider.getUriForFile(this, QuickLookFileProvider.authority(this), file)
  val mimeType = QuickLookMimeTypes.forPath(file.name) ?: QuickLookMimeTypes.ANY
  val view = Intent(Intent.ACTION_VIEW).apply {
    setDataAndType(uri, mimeType)
    addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
  }
  val chooser = Intent.createChooser(view, chooserTitle)
  val host = currentActivity
  if (host == null) {
    chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
    startActivity(chooser)
    return
  }
  host.startActivity(chooser)
}
