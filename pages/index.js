import React, { useContext, useState, useRef } from "react";
import { newModel } from "../context/data";
import Layout from "../components/Layout";
import { CompanyContext } from "../context/CompanyContext";
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import HomepageSubcategory from "../components/HomepageSubcategory";
import Modal from "../components/Modal";
import Methodology from "../components/Methodology";
import TopBarProgress from "react-topbar-progress-indicator";
import Meta from "../components/Meta";
import Hero from "../components/Hero";
import SubcategoryContainer from "../components/SubcategoryContainer";
import CategoryContainer from "../components/CategoryContainer";
import ClusterContainer from "../components/ClusterContainer";
import Toolbar from "../components/Toolbar";
import { data as newData} from "../components/data";
export default function Homepage({  }) {
  const [company, setCompany] = useContext(CompanyContext);
  const [showModal, setShowModal] = useState(false);

  const [selectedEntity, setSelectedEntity] = useState([]);
  const [loading, setLoading] = useState(false);
  const [withZoom, setWithZoom] = useState(false);

  const router = useRouter();

  TopBarProgress.config({
    barColors: {
      0: "#fdb43e",
      "1.0": "#fdb43e",
    },
    shadowBlur: 5,
  });
  // console.log("modal",showModal)

  const handleCompany = (entity) => {
    setSelectedEntity(entity);
    setShowModal(true);
  };

  const [searchResult, setSearchResult] = useState(false);

  const handleSearchMessage = () => {
    setSearchResult(true);
    setTimeout(() => setSearchResult(false), 3000);
  };

  const handleFoundCompany = (company) => {
    setLoading(!loading);
    router.push(`/company/${company}`);
  };

  const handleSearch = () => {
    if (company.searchInput !== "") {
      const result = newData.values.filter(
        (item, index) => item.name.toLowerCase() === company.searchInput
      );
      result.length === 0
        ? handleSearchMessage()
        : handleFoundCompany(result[0].name);
    }
  };

  return (
    <Layout>
      {loading && <TopBarProgress />}
      <Meta />
      <Hero />
      <section className="bg-[#083ECB]">
        <div className="px-2 md:px-6 lg:px-10">
          <Toolbar
            setLoading={setLoading}
            setWithZoom={setWithZoom}
            data={newData}
          />
          <Tooltip
            /*  style={{ backgroundColor: "#083ECB", color: "#fff" }} */
            textColor="#fff"
            id="companyName-tooltip"
          />
          <Tooltip
/*             style={{ backgroundColor: "#083ECB", color: "#fff" }} */
            textColor="#fff"
            id="category-tooltip"
            place="right"
            className="cluster-tooltip"

          />
          <Tooltip
         
/*             style={{ backgroundColor: "#083ECB", color: "#fff" }} */
            textColor="#fff"
            id="category-tooltip"
            place="right"
            className="category-tooltip"
          />
          <Tooltip
     /*       style={{ backgroundColor: "#083ECB", color: "#fff" }} */
            textColor="#fff"
            id="subcategory-tooltip"
          />

          <section className="grid gap-10" id="cluster-container">
            {Object.entries(newModel)?.map(([clusterName, values], index) => {
              return (
                <ClusterContainer
                  clusterName={clusterName}
                  values={values}
                  index={index}
                  key={index}
                >
                  {Object.entries(values?.categories).map(
                    ([categorieName, values], index) => {
                      return (
                        <CategoryContainer
                          categorieName={categorieName}
                          index={index}
                          values={values}
                          key={index}
                        >
                          {values?.subcategories?.map((subcat, index) => {
                            // if (subcat.name === 'Red Hat') console.log("subcat,", subcat, categorieName);
                            const filteredSubcategory = newData?.values.filter(
                              (company, index) =>
                                // company.category?.includes(categorieName) &&
                                company?.subcategory?.includes(subcat.name)
                            );
                            filteredSubcategory.sort((a, b) =>
                              a.name.localeCompare(b.name)
                            );
                            return (
                              <SubcategoryContainer
                                subcategory={subcat}
                                handleCompany={handleCompany}
                                filteredSubcategory={filteredSubcategory}
                                withZoom={withZoom}
                                index={index}
                                key={index}
                              />
                            );
                          })}
                        </CategoryContainer>
                      );
                    }
                  )}
                </ClusterContainer>
              );
            })}
          </section>
        </div>
      </section>

      <Methodology />
      <Modal
        selectedEntity={selectedEntity}
        setLoading={setLoading}
        setShowModal={setShowModal}
        showModal={showModal}
      />
    </Layout>
  );
}
export async function getServerSideProps(context) {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v2/companies`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
  //   },
  // });

  // const data = await res.json();
  // const cleanNullValues = await data.values.filter(
  //   (company) => company.cluster !== null || company.category !== null
  // );

  // if (!data) {
  //   return {
  //     notFound: true,
  //   };
  // }

  return {
    props: { message: 'hola' },
  };
}
