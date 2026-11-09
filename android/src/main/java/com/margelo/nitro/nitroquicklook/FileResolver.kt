package com.margelo.nitro.nitroquicklook

import android.content.Context
import android.net.Uri
import java.io.File
import java.io.FileNotFoundException

internal object FileResolver {
  private const val FILE_SCHEME = "file://"

  fun resolve(context: Context, uri: String, headers: Map<String, String>?): File {
    if (isRemote(uri)) {
      return RemoteFileDownloader.download(context, uri, headers)
    }
    return localFile(uri)
  }

  private fun isRemote(uri: String): Boolean =
    uri.startsWith("http://", ignoreCase = true) || uri.startsWith("https://", ignoreCase = true)

  private fun localFile(uri: String): File {
    val file = when {
      uri.startsWith(FILE_SCHEME) -> File(Uri.parse(uri).path ?: throw IllegalArgumentException("Invalid file uri: $uri"))
      uri.startsWith("/") -> File(uri)
      else -> throw IllegalArgumentException("Only local file paths, file:// uris and http(s) urls are supported")
    }
    if (!file.exists()) {
      throw FileNotFoundException("File not found: ${file.path}")
    }
    return file
  }
}
