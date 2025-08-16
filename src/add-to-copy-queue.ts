import { Clipboard, showToast, Toast } from "@raycast/api";
import { addToQueue, getQueueSize, getQueue } from "./queue-manager";

export default async function AddToCopyQueue() {
  try {
    // Get current clipboard content
    const clipboardText = await Clipboard.readText();

    if (!clipboardText || clipboardText.trim() === "") {
      await showToast({
        style: Toast.Style.Failure,
        title: "Nothing to copy",
        message: "Clipboard is empty or contains no text",
      });
      return;
    }

    // Check if this content is already the last item in queue
    const currentQueue = await getQueue();
    if (
      currentQueue.length > 0 &&
      currentQueue[currentQueue.length - 1].content === clipboardText
    ) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Already in queue",
        message: "This content is already the last item in queue",
      });
      return;
    }

    // Add to queue
    await addToQueue(clipboardText);

    // Get updated queue size for feedback
    const queueSize = await getQueueSize();
    const preview =
      clipboardText.length > 30
        ? clipboardText.substring(0, 30) + "..."
        : clipboardText;

    await showToast({
      style: Toast.Style.Success,
      title: `Added: "${preview}"`,
      message: `Queue now has ${queueSize} item${queueSize === 1 ? "" : "s"}`,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to add item to queue",
    });
    console.error("Add to queue error:", error);
  }
}
