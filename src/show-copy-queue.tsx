import React, { useState, useEffect } from "react";
import { Action, ActionPanel, List, showToast, Toast, Color, Clipboard, LocalStorage } from "@raycast/api";
import { getQueue, removeFromQueue, clearQueue, QueueItem } from "./queue-manager";

export default function ShowCopyQueue() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadQueue = async () => {
    try {
      const currentQueue = await getQueue();
      setQueue(currentQueue);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to load queue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteItem = async (itemId: string) => {
    try {
      // Find the item in the queue
      const item = queue.find(q => q.id === itemId);
      if (!item) return;

      // Remove this specific item from queue and copy to clipboard
      const updatedQueue = queue.filter(q => q.id !== itemId);
      setQueue(updatedQueue);
      
      // Update storage
      await LocalStorage.setItem("copy-queue", JSON.stringify(updatedQueue));
      
      // Copy to clipboard
      await Clipboard.copy(item.content);
      
      const preview = item.content.length > 30 ? item.content.substring(0, 30) + "..." : item.content;
      await showToast({
        style: Toast.Style.Success,
        title: `Ready to paste: "${preview}"`,
        message: `Press ⌘V to paste • ${updatedQueue.length} remaining in queue`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to copy item",
      });
    }
  };

  const handleClearQueue = async () => {
    try {
      await clearQueue();
      setQueue([]);
      await showToast({
        style: Toast.Style.Success,
        title: "Queue cleared",
        message: "All items removed from queue",
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Error",
        message: "Failed to clear queue",
      });
    }
  };

  useEffect(() => {
    loadQueue();
  }, []);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const getPreview = (content: string) => {
    // Replace newlines with spaces and truncate
    const cleaned = content.replace(/\s+/g, ' ').trim();
    return cleaned.length > 100 ? cleaned.substring(0, 100) + "..." : cleaned;
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Search queue items...">
      {queue.length === 0 ? (
        <List.EmptyView
          title="Queue is empty"
          description="Use 'Add to Copy Queue' to start building your sequential clipboard"
          icon="list.bullet.clipboard"
        />
      ) : (
        <>
          <List.Section title={`Queue (${queue.length} items)`}>
            {queue.map((item, index) => (
              <List.Item
                key={item.id}
                icon={{ source: `${index + 1}`, tintColor: Color.Blue }}
                title={getPreview(item.content)}
                subtitle={`Added ${formatTimestamp(item.timestamp)}`}
                accessories={[
                  { text: `${item.content.length} chars` },
                ]}
                actions={
                  <ActionPanel>
                    <Action
                      title="Copy and Remove from Queue"
                      onAction={() => handlePasteItem(item.id)}
                      shortcut={{ modifiers: ["cmd"], key: "c" }}
                    />
                    <Action
                      title="Refresh Queue"
                      onAction={loadQueue}
                      shortcut={{ modifiers: ["cmd"], key: "r" }}
                    />
                    <Action
                      title="Clear Entire Queue"
                      onAction={handleClearQueue}
                      style={Action.Style.Destructive}
                      shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        </>
      )}
    </List>
  );
}