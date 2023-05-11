import { FormEvent, useEffect, useMemo, useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { searchTitlesQuery } from "graphql";
import { Paths } from "routes";
import { useGlobalModal } from "hooks/GlobalModal";
import { useGlobalLibrary } from "hooks/GlobalLibrary";
import PageLayout from "components/Common/PageLayout";
import BooksList from "components/List.Books";
import { clearGlobalBooksState } from "state";
import {
  Form,
  FormRow,
  Input,
  RadioInput,
  RadioLabel,
  Select
} from "components/Forms/Form";
import { Card, CardTitle } from "components/Common/Containers";
import { ButtonWithIcon } from "components/Forms/Button";
import { GENRES, suppressEvent } from "utils";
import styled from "styled-components";
import ListView from "components/Common/ListView";

const SearchInput = styled(Input)`
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  height: 100%;
`;
const SearchGenre = styled(Select)`
  border-radius: 0;
  height: 100%;
`;
const SearchButton = styled(ButtonWithIcon)`
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  height: 100%;
`;

const { BookStore } = Paths;
const SEARCH_TITLES = gql(searchTitlesQuery());

/** ROUTE: Find and add books to library */
const BookStoreRoute = () => {
  // const
  const [searchBookstore, { loading, error, data }] =
    useLazyQuery(SEARCH_TITLES);
  const { clearGlobalModal } = useGlobalModal();
  const { books, series, resultsCount, resultsDesc } = useMemo(() => {
    const { books: b = [], series: s = [] } = data?.searchPublications || {};
    const count = b.length + s.length;
    return {
      books: b,
      series: s,
      resultsCount: count,
      resultsDesc: `${count} ${count === 1 ? "result" : "results"}:`
    };
  }, [data]);
  const [searchType, setSearchType] = useState("title");
  const [searchInput, setSearchInput] = useState("");
  const [searchGenre, setSearchGenre] = useState("");
  const [resultTitle, setResultTitle] = useState("Recent Publications");
  const buildVars = () => {
    const vars = { [searchType]: searchInput };
    if (searchGenre) vars.genre = searchGenre;
    return vars;
  };
  const onSearch = (e: FormEvent) => {
    suppressEvent(e);
    searchBookstore({ variables: buildVars() });
    if (searchInput) setResultTitle(`Results for "${searchInput}"`);
    setSearchInput("");
    setSearchGenre("");
  };

  useEffect(() => {
    return () => {
      clearGlobalModal();
      clearGlobalBooksState();
    };
  }, []);

  return (
    <PageLayout
      title={BookStore.Index.text}
      breadcrumbs={[BookStore.Index]}
      id="books-list"
      description={`Add <b class="accent--text">Books and Series</b> to your Library.`}
    >
      {/* Search Form */}
      <Card className={data ? undefined : "fill"}>
        <CardTitle>Find Books and Series</CardTitle>
        <Form onSubmit={onSearch}>
          <FormRow columns="4fr 1fr min-content" gap="0">
            <SearchInput
              placeholder="Enter title or description"
              value={searchInput}
              onChange={({ target }) => setSearchInput(target.value)}
            />
            <SearchGenre
              data={GENRES.ALL}
              value={searchGenre}
              itemText={(d) => d}
              itemValue={(d) => d}
              emptyMessage="No category selected."
              placeholder="All genres"
              onChange={(genre) => setSearchGenre(genre)}
            />
            <SearchButton text="Search" icon="search" />
          </FormRow>

          {/* Search type */}
          <FormRow columns="max-content repeat(2, max-content)">
            <span className="label">Search For:</span>
            <RadioLabel>
              <span>Titles</span>
              <RadioInput
                name="search-type"
                value={searchType}
                checked={searchType === "title"}
                onChange={() => setSearchType("title")}
              />
            </RadioLabel>
            <RadioLabel>
              <span>Descriptions</span>
              <RadioInput
                name="search-type"
                value={searchType}
                checked={searchType === "description"}
                onChange={() => setSearchType("description")}
              />
            </RadioLabel>
          </FormRow>
        </Form>
      </Card>

      {/* Search Results */}
      {data && (
        <>
          <hr className="transparent" />

          <Card className="fill">
            <CardTitle>{resultTitle}</CardTitle>
            {resultsCount > 0 && <p>{resultsDesc}</p>}
            <ListView
              data={books}
              itemText={(d) => d.title}
              onItemClick={(d) => {}}
              placeholder="No results found."
            />
          </Card>
        </>
      )}
    </PageLayout>
  );
};

export default BookStoreRoute;
