import { type NextPage } from "next";

import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Header from "~/components/header";

const Home: NextPage = () => {
  return (
      <PageLayout>
        <Header/>
      </PageLayout>
  );
};

export default Home;
