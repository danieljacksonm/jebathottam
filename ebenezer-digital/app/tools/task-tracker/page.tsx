import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site-url";
import { TaskTrackerClient } from "./TaskTrackerClient";

export const metadata: Metadata = pageMetadata({
  title: "Task Tracker | Ebenezer Store",
  description: "Simple browser task tracker with due dates. Free. Data stays on your device.",
  path: "/tools/task-tracker",
});

export default function TaskTrackerPage() {
  return <TaskTrackerClient />;
}
