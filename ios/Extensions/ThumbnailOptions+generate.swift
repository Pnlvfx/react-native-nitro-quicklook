import Foundation
import NitroModules
import QuickLookThumbnailing
import UIKit

extension ThumbnailOptions {
  func generate() async throws -> ThumbnailResult {
    let source = try URL(localFileUri: uri)
    let scale = await MainActor.run { self.scale ?? UIScreen.main.scale }
    let cacheFile = try cacheFileURL(for: source, scale: scale)

    if FileManager.default.fileExists(atPath: cacheFile.path) {
      let pixels = try cacheFile.pixelSize()
      return ThumbnailResult(uri: cacheFile.absoluteString, width: pixels.width, height: pixels.height)
    }
    return try await render(source: source, scale: scale, cacheFile: cacheFile)
  }

  private func render(source: URL, scale: Double, cacheFile: URL) async throws -> ThumbnailResult {
    let request = QLThumbnailGenerator.Request(
      fileAt: source,
      size: CGSize(width: size.width, height: size.height),
      scale: scale,
      representationTypes: .thumbnail
    )
    let representation = try await QLThumbnailGenerator.shared.generateBestRepresentation(for: request)

    guard let data = representation.uiImage.pngData() else {
      throw RuntimeError.error(withMessage: "Failed to encode the thumbnail as PNG")
    }
    try data.write(to: cacheFile, options: .atomic)

    return ThumbnailResult(
      uri: cacheFile.absoluteString,
      width: Double(representation.cgImage.width),
      height: Double(representation.cgImage.height)
    )
  }
}
