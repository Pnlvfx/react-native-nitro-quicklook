import Foundation

extension Array where Element == String {
  func resolvedForPreview(headers: [String: String]?) async throws -> [URL] {
    try await withThrowingTaskGroup(of: (Int, URL).self) { group in
      for (index, uri) in enumerated() {
        group.addTask {
          (index, try await URL.resolvedForPreview(uri: uri, headers: headers))
        }
      }
      var resolved: [(Int, URL)] = []
      for try await entry in group {
        resolved.append(entry)
      }
      return resolved.sorted { $0.0 < $1.0 }.map { $0.1 }
    }
  }
}
