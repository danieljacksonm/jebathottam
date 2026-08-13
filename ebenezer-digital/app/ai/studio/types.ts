export type Role = "user" | "assistant";

export type CoreState =
  | "idle"
  | "hover"
  | "typing"
  | "thinking"
  | "responding"
  | "error"
  | "success"
  | "listening"
  | "speaking";

export type ThinkLabel =
  | "THINKING"
  | "ANALYZING"
  | "SEARCHING"
  | "READING"
  | "CONNECTING IDEAS"
  | "CREATING"
  | "COMPOSING RESPONSE"
  | "FINALIZING";

export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  text?: string;
  previewUrl?: string;
};

export type Msg = {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  attachments?: Attachment[];
};

export type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  projectId?: string;
  messages: Msg[];
};

export type Project = {
  id: string;
  name: string;
  note: string;
  createdAt: number;
};

export type Artifact = {
  id: string;
  title: string;
  language: string;
  code: string;
  messageId: string;
};

export type ThemeMode = "dark" | "light";

export type Settings = {
  theme: ThemeMode;
  accent: "bronze" | "sage" | "pearl";
  language: string;
  style: "calm" | "direct" | "creative";
};

export type Health = {
  status: "checking" | "ready" | "down";
  model: string;
  models: string[];
  error?: string;
};
