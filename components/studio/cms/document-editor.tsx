"use client";

import type { StudioCollectionSlug } from "@/lib/studio/cms-meta";
import { ProjectEditor } from "@/components/studio/cms/editors/project-editor";
import { CaseStudyEditor } from "@/components/studio/cms/editors/case-study-editor";
import { PostEditor } from "@/components/studio/cms/editors/post-editor";
import { MediaEditor } from "@/components/studio/cms/editors/media-editor";
import {
  AnalyticsEventEditor,
  MessageEditor,
  ResourceLeadEditor,
  TeamMemberEditor,
  TestimonialEditor,
  UserEditor,
} from "@/components/studio/cms/editors/other-editors";

export function CollectionDocumentEditor({
  slug,
  doc,
  isNew,
  deliveryStatusAvailable,
  currentUserId,
}: {
  slug: StudioCollectionSlug;
  doc: Record<string, unknown> | null;
  isNew: boolean;
  deliveryStatusAvailable: boolean;
  currentUserId: string | number;
}) {
  switch (slug) {
    case "projects":
      return <ProjectEditor initialDoc={doc} isNew={isNew} deliveryStatusAvailable={deliveryStatusAvailable} />;
    case "case-studies":
      return <CaseStudyEditor initialDoc={doc} isNew={isNew} />;
    case "posts":
      return <PostEditor initialDoc={doc} isNew={isNew} />;
    case "media":
      return <MediaEditor initialDoc={doc} isNew={isNew} />;
    case "testimonials":
      return <TestimonialEditor initialDoc={doc} isNew={isNew} />;
    case "team-members":
      return <TeamMemberEditor initialDoc={doc} isNew={isNew} />;
    case "messages":
      if (!doc) return null;
      return <MessageEditor initialDoc={doc} />;
    case "resource-leads":
      return <ResourceLeadEditor initialDoc={doc} isNew={isNew} />;
    case "analytics-events":
      if (!doc) return null;
      return <AnalyticsEventEditor initialDoc={doc} />;
    case "users":
      return <UserEditor initialDoc={doc} isNew={isNew} currentUserId={currentUserId} />;
  }
}
