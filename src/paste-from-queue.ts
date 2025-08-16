import { Clipboard, showToast, Toast } from "@raycast/api";
import { removeFromQueue, getQueueSize } from "./queue-manager";

export default async function PasteFromQueue() {
  try {
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
      nextItem.length > 30 ? nextItem.substring(0, 30) + "..." : nextItem;

    await showToast({
      style: Toast.Style.Success,
      title: `Ready to paste: "${preview}"`,
      message: `Press ⌘V to paste • ${remainingItems} remaining in queue`,
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
