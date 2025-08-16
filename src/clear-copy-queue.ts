import { showToast, Toast, confirmAlert, Alert } from "@raycast/api";
import { clearQueue, getQueueSize } from "./queue-manager";

export default async function ClearCopyQueue() {
  try {
    // Check if queue is already empty
    const currentSize = await getQueueSize();

    if (currentSize === 0) {
      await showToast({
        style: Toast.Style.Success,
        title: "Queue already empty",
        message: "Nothing to clear",
      });
      return;
    }

    // Ask for confirmation
    const confirmed = await confirmAlert({
      title: "Clear Copy Queue",
      message: `Are you sure you want to remove all ${currentSize} item${currentSize === 1 ? "" : "s"} from the queue?`,
      primaryAction: {
        title: "Clear Queue",
        style: Alert.ActionStyle.Destructive,
      },
      dismissAction: {
        title: "Cancel",
        style: Alert.ActionStyle.Cancel,
      },
    });

    if (!confirmed) {
      return;
    }

    // Clear the queue
    await clearQueue();

    await showToast({
      style: Toast.Style.Success,
      title: "Queue cleared",
      message: `Removed ${currentSize} item${currentSize === 1 ? "" : "s"} from queue`,
    });
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Error",
      message: "Failed to clear queue",
    });
    console.error("Clear queue error:", error);
  }
}
