import Foundation
import NitroModules

private let fileScheme = "file://"

extension URL {
  init(localFileUri uri: String) throws {
    if uri.hasPrefix(fileScheme) {
      self = URL(string: uri) ?? URL(fileURLWithPath: String(uri.dropFirst(fileScheme.count)))
      return
    }
    guard uri.hasPrefix("/") else {
      throw RuntimeError.error(withMessage: "Only local file paths and file:// uris are supported")
    }
    self = URL(fileURLWithPath: uri)
  }
}
