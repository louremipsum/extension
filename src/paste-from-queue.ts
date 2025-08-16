import { Clipboard, showToast, Toast, getPreferenceValues } from "@raycast/api";
import { removeFromQueue, getQueueSize } from "./queue-manager";

export default async function PasteFromQueue() {
  try {
    const preferences = getPreferenceValues<{ showPreviewLength: string }>();
    const previewLength = parseInt(preferences.showPreviewLength) || 50;
    
    // Get next item from queue
    const nextItem = await removeFromQueue();

    if (!nextItem) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Queue empty",
        message: "No items in copy queue",
      });
      return;
    }

    // Copy item to system clipboard
    await Clipboard.copy(nextItem);

    // Get remaining queue size for feedback
    const remainingItems = await getQueueSize();

    // Show preview of what was copied
    const preview =
      nextItem.length > previewLength ? nextItem.substring(0, previewLength) + "..." : nextItem;

    await showToast({
      style: Toast.Style.Success,
      title: `Copied to clipboard: "${preview}"`,
      message: `Now press ⌘V to paste • ${remainingItems} remaining in queue`,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to get item from queue",
    });
    console.error("Paste from queue error:", error);
  }
}
