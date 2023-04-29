import { AppRouteDef } from "routes";
import { PageContainer, PageDescription, PageTitle } from "./Containers";
import Breadcrumbs from "./Breadcrumbs";
import styled from "styled-components";

type PageLayoutProps = {
  title: string | React.ReactNode;
  id?: string;
  breadcrumbs?: AppRouteDef[];
  description?: string;
  children?: React.ReactNode;
};

const PageHeader = styled.header`
  ${PageDescription} {
    margin-bottom: 0.75rem;
  }
`

// Default Layout for app pages
const PageLayout = (props: PageLayoutProps) => {
  const { title, id, breadcrumbs, description, children } = props;
  return (
    // Header
    <PageContainer>
      <PageHeader>
        {breadcrumbs && <Breadcrumbs data={breadcrumbs} />}
        <PageTitle>{title}</PageTitle>
        {description && (
          <PageDescription dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </PageHeader>

      {/* Page content */}
      {children}
    </PageContainer>
  );
};

export default PageLayout;
