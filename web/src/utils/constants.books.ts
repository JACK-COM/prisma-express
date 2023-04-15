/**
 * @file Books.ts
 * @description Book, Chapter, and related types/constants
 */

// Genres
const FICTION = [
  "Fiction",
  "Action",
  "Drama",
  "Children's",
  "Classical",
  "Christian",
  "Young Adult",
  "Fable",
  "Fairy Tale",
  "Fantasy",
  "Fiction",
  "Folklore",
  "Historical Fiction",
  "Horror",
  "Thriller",
  "Comedy/Humor",
  "Romance",
  "Erotica",
  "LGBTQ+",
  "Mystery",
  "Poetry",
  "Sci-Fi",
  "Other"
];
const NONFICTION = [
  "Academic",
  "Autobiography",
  "Biography/AutoBigraphy",
  "Business",
  "Cookbook",
  "Essay",
  "Guide",
  "How-To",
  "Journal",
  "Journalism",
  "Manual",
  "Memoir",
  "Narrative Non-Fiction",
  "Nonfiction",
  "Reference",
  "Religion",
  "Self-Help",
  "Speech",
  "Textbook",
  "Travel",
  "True Crime",
  "Other"
];

export enum BookCategory {
  Fiction = "Fiction",
  Nonfiction = "Nonfiction"
}

export const GENRES = {
  [BookCategory.Fiction]: FICTION,
  [BookCategory.Nonfiction]: NONFICTION,
  ALL: [...FICTION, ...NONFICTION]
};
