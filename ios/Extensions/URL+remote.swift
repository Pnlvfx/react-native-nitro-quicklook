import Foundation
import NitroModules
import UniformTypeIdentifiers

private let downloadsDirectoryName = "nitro-quicklook-downloads"

extension URL {
  init?(remoteUri uri: String) {
    guard let url = URL(string: uri), let scheme = url.scheme?.lowercased(), scheme == "http" || scheme == "https" else {
      return nil
    }
    self = url
  }

  var hasKnownFileType: Bool {
    !pathExtension.isEmpty && UTType(filenameExtension: pathExtension) != nil
  }

  static func resolvedForPreview(uri: String, headers: [String: String]?) async throws -> URL {
    guard let remote = URL(remoteUri: uri) else {
      return try URL(localFileUri: uri)
    }
    return try await remote.download(headers: headers)
  }

  private func download(headers: [String: String]?) async throws -> URL {
    var request = URLRequest(url: self)
    headers?.forEach { request.setValue($1, forHTTPHeaderField: $0) }

    let (temporary, response) = try await URLSession.shared.download(for: request)
    if let http = response as? HTTPURLResponse, !(200..<300).contains(http.statusCode) {
      throw RuntimeError.error(withMessage: "Download failed with status \(http.statusCode): \(absoluteString)")
    }

    let name = lastPathComponent.contains(".") ? lastPathComponent : (response.suggestedFilename ?? "download")
    let directory = FileManager.default.temporaryDirectory
      .appendingPathComponent(downloadsDirectoryName, isDirectory: true)
      .appendingPathComponent(UUID().uuidString, isDirectory: true)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)

    let destination = directory.appendingPathComponent(name)
    try FileManager.default.moveItem(at: temporary, to: destination)
    return destination
  }
}
