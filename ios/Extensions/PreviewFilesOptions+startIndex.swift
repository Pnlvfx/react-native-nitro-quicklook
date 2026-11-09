import Foundation

extension PreviewFilesOptions {
  func startIndex(count: Int) -> Int {
    min(max(Int(initialIndex ?? 0), 0), count - 1)
  }
}
