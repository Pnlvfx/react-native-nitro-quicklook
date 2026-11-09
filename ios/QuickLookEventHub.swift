import Foundation

final class QuickLookEventHub {
  var onWillDismiss: (() -> Void)?
  var onDismiss: (() -> Void)?
  var onEditedFile: ((EditedFileEvent) -> Void)?
  var onSavedEditedCopy: ((SavedEditedCopyEvent) -> Void)?
}
