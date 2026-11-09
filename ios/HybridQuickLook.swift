import Foundation
import NitroModules
import QuickLook

final class HybridQuickLook: HybridQuickLookSpec {
  private let hub = QuickLookEventHub()

  func previewFile(options: PreviewFileOptions) throws -> Promise<Void> {
    let hub = hub
    return Promise.async {
      let file = try await URL.resolvedForPreview(uri: options.uri, headers: options.requestOptions?.headers)
      try await QuickLookPresenter.present(
        items: [file],
        initialIndex: 0,
        editingMode: options.editingMode ?? .disabled,
        hub: hub
      )
    }
  }

  func previewFiles(options: PreviewFilesOptions) throws -> Promise<Void> {
    guard !options.uris.isEmpty else {
      throw RuntimeError.error(withMessage: "uris must contain at least one file")
    }
    let hub = hub
    return Promise.async {
      let files = try await options.uris.resolvedForPreview(headers: options.requestOptions?.headers)
      try await QuickLookPresenter.present(
        items: files,
        initialIndex: options.startIndex(count: files.count),
        editingMode: options.editingMode ?? .disabled,
        hub: hub
      )
    }
  }

  func canPreview(uri: String) throws -> Promise<Bool> {
    return Promise.async {
      if let remote = URL(remoteUri: uri) {
        return remote.hasKnownFileType
      }
      let file = try URL(localFileUri: uri)
      return await MainActor.run { QLPreviewController.canPreview(file as NSURL) }
    }
  }

  func generateThumbnail(options: ThumbnailOptions) throws -> Promise<ThumbnailResult> {
    return Promise.async {
      try await options.generate()
    }
  }

  func setOnWillDismiss(callback: (() -> Void)?) throws {
    hub.onWillDismiss = callback
  }

  func setOnDismiss(callback: (() -> Void)?) throws {
    hub.onDismiss = callback
  }

  func setOnEditedFile(callback: ((EditedFileEvent) -> Void)?) throws {
    hub.onEditedFile = callback
  }

  func setOnSavedEditedCopy(callback: ((SavedEditedCopyEvent) -> Void)?) throws {
    hub.onSavedEditedCopy = callback
  }
}
