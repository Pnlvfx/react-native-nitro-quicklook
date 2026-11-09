package com.margelo.nitro.nitroquicklook

import android.webkit.MimeTypeMap

internal object QuickLookMimeTypes {
  const val ANY = "*/*"

  fun forPath(path: String): String? {
    val extension = MimeTypeMap.getFileExtensionFromUrl(path).lowercase()
    if (extension.isEmpty()) return null
    return MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension)
  }

  fun extensionFor(mimeType: String): String? = MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType)
}
