import Foundation
import ImageIO
import NitroModules

extension URL {
  func pixelSize() throws -> (width: Double, height: Double) {
    guard
      let source = CGImageSourceCreateWithURL(self as CFURL, nil),
      let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any],
      let width = properties[kCGImagePropertyPixelWidth] as? Double,
      let height = properties[kCGImagePropertyPixelHeight] as? Double
    else {
      throw RuntimeError.error(withMessage: "Failed to read the cached thumbnail size")
    }
    return (width, height)
  }
}
