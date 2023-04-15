import { AppRouteDef } from "routes";
import { PageContainer, PageDescription, PageTitle } from "./Containers";
import Breadcrumbs from "./Breadcrumbs";

type PageLayoutProps = {
  title: string;
  id?: string;
  breadcrumbs?: AppRouteDef[];
  description?: string;
  children?: React.ReactNode;
};

// Default Layout for app pages
const PageLayout = (props: PageLayoutProps) => {
  const { title, id, breadcrumbs, description, children } = props;
  return (
    // Header
    <PageContainer>
      <header>
        {breadcrumbs && <Breadcrumbs data={breadcrumbs} />}
        <PageTitle>{title}</PageTitle>
        {description && (
          <PageDescription dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </header>

      {/* Page content */}
      {children}
    </PageContainer>
  );
};

export default PageLayout;
