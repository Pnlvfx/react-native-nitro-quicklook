package com.margelo.nitro.nitroquicklook

import android.content.Intent
import android.net.Uri
import com.facebook.react.bridge.ReactApplicationContext

private val probeUri: Uri = Uri.parse("content://nitroquicklook/probe")

internal fun ReactApplicationContext.canHandleView(mimeType: String): Boolean {
  val probe = Intent(Intent.ACTION_VIEW).setDataAndType(probeUri, mimeType)
  return probe.resolveActivity(packageManager) != null
}
