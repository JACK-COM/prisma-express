import { AppRouteDef } from "routes";
import {
  PageContainer,
  PageDescription,
  PageTitleVariable
} from "./Containers";
import Breadcrumbs from "./Breadcrumbs";
import styled, { css } from "styled-components";
import { FocusEventHandler, useState } from "react";

type PageLayoutProps = {
  title: string | React.ReactNode;
  id?: string;
  breadcrumbs?: AppRouteDef[];
  editableHeader?: boolean;
  description?: string;
  children?: React.ReactNode;
};

const autoColumn = css`
  grid-column: 2;
  @media screen and (max-width: 768px) {
    grid-column: unset;
    grid-row: unset;
  }
`;
const Page = styled(PageContainer)`
  ${autoColumn}
  grid-row: 2;
`;
const PageHeader = styled.header`
  ${autoColumn}
  background: ${({ theme }) => theme.colors.bgGradient};
  color: #fff;
  padding: 0.5rem 0.5rem 0;
  position: sticky;
  top: 0;
  z-index: 998;

  ${PageDescription} {
    padding-bottom: 0.2rem;
    margin: 0;
  }

  @media (max-width: 768px) {
    background: transparent;
  }
`;

// Default Layout for app pages
const PageLayout = (props: PageLayoutProps) => {
  const {
    title,
    editableHeader = false,
    breadcrumbs,
    description,
    children
  } = props;

  return (
    // Header
    <>
      <PageHeader id="page-header">
        <PageTitleVariable className="h4">{title}</PageTitleVariable>
        {description && (
          <PageDescription dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </PageHeader>

      <Page id="page-layout">
        {breadcrumbs && Boolean(false) && <Breadcrumbs data={breadcrumbs} />}

        {/* Page content */}
        {children}
      </Page>
    </>
  );
};

export default PageLayout;
