import CryptoKit
import Foundation
import NitroModules

private let cacheDirectoryName = "nitro-quicklook"

extension ThumbnailOptions {
  func cacheFileURL(for source: URL, scale: Double) throws -> URL {
    guard let attributes = try? FileManager.default.attributesOfItem(atPath: source.path) else {
      throw RuntimeError.error(withMessage: "File not found: \(source.path)")
    }
    let modified = (attributes[.modificationDate] as? Date)?.timeIntervalSince1970 ?? 0
    let bytes = (attributes[.size] as? NSNumber)?.intValue ?? 0
    let key = "\(source.path)|\(modified)|\(bytes)|\(size.width)|\(size.height)|\(scale)"
    let name = SHA256.hash(data: Data(key.utf8)).map { String(format: "%02x", $0) }.joined()

    let caches = try FileManager.default.url(for: .cachesDirectory, in: .userDomainMask, appropriateFor: nil, create: true)
    let directory = caches.appendingPathComponent(cacheDirectoryName, isDirectory: true)
    try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
    return directory.appendingPathComponent("\(name).png")
  }
}
