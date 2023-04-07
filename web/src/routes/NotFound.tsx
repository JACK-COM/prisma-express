import { PageContainer } from "components/Common/Containers";

const NotFound = () => {
  return (
    <PageContainer>
      <h1>Page Not Found</h1>

      <div className="card">
        <p>Not sure how to tell you this ...</p>
        <p>Oh, we already did: the content you seek is not here.</p>
        <p>But was it ever?</p>
      </div>
    </PageContainer>
  );
};

export default NotFound;
