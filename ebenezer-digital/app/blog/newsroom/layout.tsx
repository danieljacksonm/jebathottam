import type { ReactNode } from "react";
import { NewsChrome } from "../news/components/NewsChrome";

export default function NewsroomLayout({ children }: { children: ReactNode }) {
  return <NewsChrome>{children}</NewsChrome>;
}
