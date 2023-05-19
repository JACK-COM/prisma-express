/**
 * @file Books.ts
 * @description Book, Chapter, and related types/constants
 */

// Genres
const FICTION = [
  "Action",
  "Adventure",
  "Children's",
  "Choose-Your-Own-Adventure",
  "Christian",
  "Classical",
  "Comedy/Humor",
  "Drama",
  "Erotica",
  "Fable",
  "Fairy Tale",
  "Fantasy",
  "Fiction",
  "Fiction",
  "Folklore",
  "Historical Fiction",
  "Horror",
  "LGBTQ+",
  "Mystery",
  "Poetry",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "Young Adult",
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
