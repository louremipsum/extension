import { LocalStorage, getPreferenceValues } from "@raycast/api";

const QUEUE_KEY = "copy-queue";

export interface QueueItem {
  id: string;
  content: string;
  timestamp: Date;
}

interface Preferences {
  maxQueueSize: string;
  showPreviewLength: string;
}

export async function addToQueue(content: string): Promise<void> {
  const preferences = getPreferenceValues<Preferences>();
  const maxSize = parseInt(preferences.maxQueueSize) || 0;

  const currentQueue = await getQueue();
  const newItem: QueueItem = {
    id: Date.now().toString(),
    content: content,
    timestamp: new Date(),
  };

  currentQueue.push(newItem);

  // Trim queue if it exceeds max size (0 means unlimited)
  if (maxSize > 0 && currentQueue.length > maxSize) {
    currentQueue.splice(0, currentQueue.length - maxSize);
  }

  await LocalStorage.setItem(QUEUE_KEY, JSON.stringify(currentQueue));
}

export async function removeFromQueue(): Promise<string | null> {
  const currentQueue = await getQueue();

  if (currentQueue.length === 0) {
    return null;
  }

  const nextItem = currentQueue.shift(); // Remove first item (FIFO)
  await LocalStorage.setItem(QUEUE_KEY, JSON.stringify(currentQueue));

  return nextItem?.content || null;
}

export async function getQueue(): Promise<QueueItem[]> {
  try {
    const queueData = await LocalStorage.getItem<string>(QUEUE_KEY);
    if (!queueData) {
      return [];
    }

    const parsed = JSON.parse(queueData);
    // Convert timestamp strings back to Date objects
    return parsed.map((item: unknown) => {
      const queueItem = item as {
        id: string;
        content: string;
        timestamp: string | Date;
      };
      return {
        ...queueItem,
        timestamp: new Date(queueItem.timestamp),
      };
    });
  } catch (error) {
    console.error("Error parsing queue data:", error);
    return [];
  }
}

export async function clearQueue(): Promise<void> {
  await LocalStorage.setItem(QUEUE_KEY, JSON.stringify([]));
}

export async function getQueueSize(): Promise<number> {
  const queue = await getQueue();
  return queue.length;
}
