package com.margelo.nitro.nitroquicklook

import android.content.Context
import androidx.core.content.FileProvider

class QuickLookFileProvider : FileProvider() {
  companion object {
    internal fun authority(context: Context): String = "${context.packageName}.nitroquicklook.fileprovider"
  }
}
