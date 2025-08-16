/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Maximum Queue Size - Maximum number of items to keep in queue (0 = unlimited) */
  "maxQueueSize": string,
  /** Preview Text Length - How much text to show in previews */
  "showPreviewLength": "30" | "50" | "100"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `add-to-copy-queue` command */
  export type AddToCopyQueue = ExtensionPreferences & {}
  /** Preferences accessible in the `paste-from-queue` command */
  export type PasteFromQueue = ExtensionPreferences & {}
  /** Preferences accessible in the `show-copy-queue` command */
  export type ShowCopyQueue = ExtensionPreferences & {}
  /** Preferences accessible in the `clear-copy-queue` command */
  export type ClearCopyQueue = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `add-to-copy-queue` command */
  export type AddToCopyQueue = {}
  /** Arguments passed to the `paste-from-queue` command */
  export type PasteFromQueue = {}
  /** Arguments passed to the `show-copy-queue` command */
  export type ShowCopyQueue = {}
  /** Arguments passed to the `clear-copy-queue` command */
  export type ClearCopyQueue = {}
}

