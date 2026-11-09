package com.margelo.nitro.nitroquicklook

import android.content.Context
import java.io.File
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URL
import java.util.UUID

internal object RemoteFileDownloader {
  private const val DOWNLOADS_DIRECTORY = "nitro-quicklook-downloads"
  private const val TIMEOUT_MS = 30_000
  private const val FALLBACK_NAME = "download"

  fun download(context: Context, url: String, headers: Map<String, String>?): File {
    val connection = openConnection(url, headers)
    try {
      if (connection.responseCode !in 200..299) {
        throw IOException("Download failed with status ${connection.responseCode}: $url")
      }
      val destination = destinationFile(context, URL(url), connection.contentType)
      connection.inputStream.use { input ->
        destination.outputStream().use { output -> input.copyTo(output) }
      }
      return destination
    } finally {
      connection.disconnect()
    }
  }

  private fun openConnection(url: String, headers: Map<String, String>?): HttpURLConnection {
    val connection = URL(url).openConnection() as? HttpURLConnection
      ?: throw IllegalArgumentException("Unsupported url: $url")
    connection.connectTimeout = TIMEOUT_MS
    connection.readTimeout = TIMEOUT_MS
    headers?.forEach { (name, value) -> connection.setRequestProperty(name, value) }
    return connection
  }

  private fun destinationFile(context: Context, url: URL, contentType: String?): File {
    val directory = File(File(context.cacheDir, DOWNLOADS_DIRECTORY), UUID.randomUUID().toString())
    if (!directory.mkdirs()) {
      throw IOException("Could not create download directory: ${directory.path}")
    }
    return File(directory, fileName(url, contentType))
  }

  private fun fileName(url: URL, contentType: String?): String {
    val name = url.path.substringAfterLast('/').ifEmpty { FALLBACK_NAME }
    if (name.contains('.')) return name
    val extension = contentType?.substringBefore(';')?.trim()?.let { QuickLookMimeTypes.extensionFor(it) }
    return if (extension == null) name else "$name.$extension"
  }
}
