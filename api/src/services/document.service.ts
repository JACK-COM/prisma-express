import { Book } from "@prisma/client";
import { context } from "../graphql/context";
import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  SectionType,
  TextRun
} from "docx";

const { Books } = context;
// const BOOK_TEMPLATE = path.join(__dirname, "./documents/book-template-easyx.docx");
// const BOOK_TEMPLATE = path.join(__dirname, "./documents/book-template-carbone.docx");

/** download the contents of an entire `Book` */
export async function downloadBook(id: Book["id"]) {
  return await Books.findUnique({
    where: { id },
    include: {
      Author: { select: { firstName: true, lastName: true } },
      Chapters: {
        include: { Scenes: { orderBy: { order: "asc" } } },
        orderBy: { order: "asc" }
      }
    }
  });
}

/** Generate a .docx file from a `Book` */
type DocxData = { data: Buffer; name: string };
export async function generateDocx(id: Book["id"]): Promise<DocxData> {
  const book = await downloadBook(id);
  if (!book) throw new Error("Book not found");
  book.order = book.order || 0;
  const { title, Author } = book;
  const { firstName, lastName } = Author || {
    firstName: "Anonymous",
    lastName: ""
  };
  const authorName = `${firstName} ${lastName}`;
  const titleAuthor = `${title} | ${authorName}`;
  const chapterHeading = (order: number, title: string) =>
    new Paragraph({
      text: `Chapter ${order}: ${title}`,
      heading: HeadingLevel.HEADING_3
    });

  const headfoot = (order: number) => ({
    default: {
      options: {
        children: [new Paragraph(`${titleAuthor} | Chapter ${order}`)]
      }
    }
  });
  const paragraph = {
    keepLines: true,
    spacing: { line: 276, after: 50 },
    indent: { firstLine: 360 }
  };
  const docxFile = new Document({
    creator: authorName,
    title: titleAuthor,
    description: book.description || `A book by ${authorName}`,
    styles: {
      default: {
        heading1: { run: { font: "Calibri" }, paragraph },
        heading2: { run: { font: "Calibri" }, paragraph },
        heading3: { run: { font: "Calibri" }, paragraph },
        heading4: { run: { font: "Calibri" }, paragraph },
        heading5: { run: { font: "Calibri" }, paragraph },
        heading6: { run: { font: "Calibri" }, paragraph }
      }
    },
    sections: [
      {
        children: [
          // Title
          new Paragraph({ text: book.title, heading: HeadingLevel.TITLE }),
          // Author
          new Paragraph({ text: authorName, heading: HeadingLevel.HEADING_6 })
        ]
      },

      // Chapters
      ...book.Chapters.map((chapter, i) => ({
        properties: { type: SectionType.NEXT_PAGE },
        footers: headfoot(chapter.order || i + 1),
        children: [
          // Chapter Heading
          chapterHeading(chapter.order || i + 1, chapter.title),

          // Scenes
          ...chapter.Scenes.map((scene) => {
            const $sceneTitle = new Paragraph({
              text: scene.title,
              heading: HeadingLevel.HEADING_4
            });

            // Break scene text into paragraphs/html tags. filter empty strings, line-breaks, and allowed tags
            const $p: Paragraph[] = [];
            splitByTag(scene.text, "p").forEach((t) => {
              const clean = t.replaceAll(/(&nbsp;)/gm, " ");
              let children: any[] = splitByTag(clean, "strong");
              if (children.length === 1) return $p.push(new Paragraph(clean));

              children = children.map((s) => {
                const cs = s.replaceAll(/(&nbsp;)/gm, " ");
                return new TextRun({
                  text: cs,
                  bold: !s.startsWith("<")
                });
              });
              return $p.push(new Paragraph({ children }));
            });

            return [$sceneTitle, ...$p];
          }).flat(1)
        ]
      }))
    ]
  });
  const fileBuf = await Packer.toBuffer(docxFile);
  return { data: fileBuf, name: `${book.title}.docx` };
}

/** Split a body of text by a specific tag, and remove the tag from the resulting list */
function splitByTag(text: string, tag: string) {
  const tagRegex = new RegExp(`<\/?${tag}\\b[^>]*>`, "gim");
  return text
    .split(tagRegex)
    .filter((t) => t.length && t !== "\n" && t !== tag);
}
