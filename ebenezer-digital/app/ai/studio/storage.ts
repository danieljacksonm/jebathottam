import type { Project, Settings, Thread } from "./types";

const THREADS_KEY = "ebenezer-ai-os-threads-v2";
const PROJECTS_KEY = "ebenezer-ai-os-projects-v1";
const SETTINGS_KEY = "ebenezer-ai-os-settings-v1";

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function loadThreads(): Thread[] {
  try {
    const raw = localStorage.getItem(THREADS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveThreads(threads: Thread[]) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(threads.slice(0, 60)));
}

export function loadProjects(): Project[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects.slice(0, 30)));
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { theme: "dark", accent: "bronze", language: "en", style: "calm" };
    }
    return {
      theme: "dark",
      accent: "bronze",
      language: "en",
      style: "calm",
      ...JSON.parse(raw),
    };
  } catch {
    return { theme: "dark", accent: "bronze", language: "en", style: "calm" };
  }
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function extractArtifacts(content: string, messageId: string) {
  const artifacts: { title: string; language: string; code: string; messageId: string; id: string }[] =
    [];
  const re = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(content))) {
    const language = match[1] || "text";
    const code = match[2].trim();
    if (code.length < 12) continue;
    artifacts.push({
      id: `${messageId}-${i++}`,
      messageId,
      language,
      code,
      title: language === "html" ? "Preview" : `${language} · artifact`,
    });
  }
  return artifacts;
}
