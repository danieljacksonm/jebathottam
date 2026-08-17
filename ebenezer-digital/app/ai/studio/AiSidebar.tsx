"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Bookmark,
  FolderKanban,
  MessageSquarePlus,
  Search,
  Settings,
  Trash2,
  User,
  X,
} from "lucide-react";
import { SiteContactLinks } from "@/components/SiteContactLinks";
import type { Project, Thread } from "./types";

export function AiSidebar({
  open,
  mobile,
  onClose,
  onNew,
  onSearch,
  onOpenSettings,
  threads,
  projects,
  activeId,
  onSelect,
  onDelete,
  onNewProject,
}: {
  open: boolean;
  mobile: boolean;
  onClose: () => void;
  onNew: () => void;
  onSearch: () => void;
  onOpenSettings: () => void;
  threads: Thread[];
  projects: Project[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewProject: () => void;
}) {
  return (
    <>
      {mobile && open && <button className="ai-backdrop" aria-label="Close sidebar" onClick={onClose} />}
      <aside className={`ai-side ${open ? "is-open" : ""} ${mobile ? "is-mobile" : ""}`}>
        <div className="ai-side-top">
          <Link href="/ai" className="ai-mark" data-cursor="HOME" aria-label="Eben AI">
            <Image src="/brand/eben-ai-mark.svg" alt="Eben AI" width={36} height={36} />
          </Link>
          {mobile && (
            <button type="button" className="ai-icon" onClick={onClose} aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <nav className="ai-side-nav">
          <button type="button" onClick={onNew} data-cursor="NEW">
            <MessageSquarePlus className="h-4 w-4" />
            <span>New Chat</span>
          </button>
          <button type="button" onClick={onSearch} data-cursor="FIND">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </button>
          <button type="button" onClick={onNewProject}>
            <FolderKanban className="h-4 w-4" />
            <span>Projects</span>
          </button>
          <button type="button" className="is-quiet">
            <Bookmark className="h-4 w-4" />
            <span>Saved</span>
          </button>
        </nav>

        <p className="ai-side-label">Recent</p>
        <div className="ai-side-list">
          {threads.length === 0 && <p className="ai-side-empty">No conversations yet.</p>}
          {threads.map((t) => (
            <div key={t.id} className={`ai-side-item ${t.id === activeId ? "is-active" : ""}`}>
              <button type="button" onClick={() => onSelect(t.id)}>
                {t.title || "Untitled"}
              </button>
              <button type="button" aria-label="Delete chat" onClick={() => onDelete(t.id)}>
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>

        {projects.length > 0 && (
          <>
            <p className="ai-side-label">Projects</p>
            <div className="ai-side-list">
              {projects.map((p) => (
                <div key={p.id} className="ai-side-item">
                  <span>{p.name}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="ai-side-foot">
          <button type="button" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <span className="ai-side-user">
            <User className="h-4 w-4" />
            <span>You</span>
          </span>
          <SiteContactLinks stacked className="ai-side-contact" />
        </div>
      </aside>
    </>
  );
}
