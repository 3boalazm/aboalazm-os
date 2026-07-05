import type { Metadata } from "next";
import { BooksView } from "./books-view";

export const metadata: Metadata = {
  title: "Library — Interactive Design Books",
  description:
    "Books and references on design and branding, rebuilt as a staged, interactive reading experience.",
};

export default function BooksPage() {
  return <BooksView />;
}
