import { AppRouteDef } from "routes";
import {
  GridContainer,
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
const Page = styled(GridContainer)`
  display: block;
  ${autoColumn}
  grid-row: 2;
  height: -webkit-fill-available;

  .fill {
    min-height: calc(100vh - 100px);
  }
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
const Footer = styled.footer`
  font-size: smaller;
  line-height: 2.4rem;
  grid-column: 1 / -1;
  grid-row: 3 / 3;
  padding: 0 ${({ theme }) => theme.sizes.sm};
`;

// Default Layout for app pages
const PageLayout = (props: PageLayoutProps) => {
  const { title, breadcrumbs, description, children } = props;

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
        {/* {breadcrumbs && Boolean(false) && <Breadcrumbs data={breadcrumbs} />} */}

        {/* Page content */}
        {children}

        {/* Footer */}
        <Footer>© Copyright {new Date().getFullYear()} Mythos Forge </Footer>
      </Page>
    </>
  );
};

export default PageLayout;
