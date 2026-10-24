import type { ServiceId } from "@/lib/contact-context";
import type { Project } from "./types";

/** Preselect the enquiry track that best matches the project being viewed. */
export function projectEnquiryService(project: Pick<Project, "category" | "discipline">): ServiceId {
  if (project.category === "design") return "brand-identity";
  if (project.discipline === "Product Architecture") return "digital-product";
  return "website";
}
