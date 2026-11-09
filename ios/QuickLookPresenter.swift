import NitroModules
import QuickLook
import UIKit

@MainActor
final class QuickLookPresenter: NSObject, QLPreviewControllerDataSource, QLPreviewControllerDelegate {
  private let items: [URL]
  private let editingMode: EditingMode
  private let hub: QuickLookEventHub
  private var dismissal: CheckedContinuation<Void, Never>?

  static func present(items: [URL], initialIndex: Int, editingMode: EditingMode, hub: QuickLookEventHub) async throws {
    let presenter = QuickLookPresenter(items: items, editingMode: editingMode, hub: hub)
    try await presenter.show(initialIndex: initialIndex)
  }

  private init(items: [URL], editingMode: EditingMode, hub: QuickLookEventHub) {
    self.items = items
    self.editingMode = editingMode
    self.hub = hub
    super.init()
  }

  private func show(initialIndex: Int) async throws {
    guard let top = UIApplication.shared.topViewController else {
      throw RuntimeError.error(withMessage: "No view controller available to present the preview")
    }
    let controller = QLPreviewController()
    controller.dataSource = self
    controller.delegate = self
    controller.currentPreviewItemIndex = initialIndex
    await withCheckedContinuation { continuation in
      dismissal = continuation
      top.present(controller, animated: true)
    }
  }

  func numberOfPreviewItems(in controller: QLPreviewController) -> Int {
    items.count
  }

  func previewController(_ controller: QLPreviewController, previewItemAt index: Int) -> QLPreviewItem {
    items[index] as NSURL
  }

  func previewController(_ controller: QLPreviewController, editingModeFor previewItem: QLPreviewItem) -> QLPreviewItemEditingMode {
    switch editingMode {
    case .disabled:
      return .disabled
    case .createcopy:
      return .createCopy
    case .updatecontents:
      return .updateContents
    }
  }

  func previewControllerWillDismiss(_ controller: QLPreviewController) {
    hub.onWillDismiss?()
  }

  func previewControllerDidDismiss(_ controller: QLPreviewController) {
    hub.onDismiss?()
    dismissal?.resume()
    dismissal = nil
  }

  func previewController(_ controller: QLPreviewController, didUpdateContentsOf previewItem: QLPreviewItem) {
    hub.onEditedFile?(EditedFileEvent(filePath: previewItem.previewItemURL?.path ?? ""))
  }

  func previewController(_ controller: QLPreviewController, didSaveEditedCopyOf previewItem: QLPreviewItem, at modifiedContentsURL: URL) {
    hub.onSavedEditedCopy?(
      SavedEditedCopyEvent(originalPath: previewItem.previewItemURL?.path ?? "", editedPath: modifiedContentsURL.path)
    )
  }
}
