import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import Loader from "./Loader";
import { useRouter } from "next/router";
import { subcategoriesDescriptions } from "../utils/categoriesAndSubcategories";

export default function homepageSubcategory({
  handleCompany,
  subcategoryName,
  filteredCategory,
  handleEntity,
  withZoom,
}) {
  const router = useRouter();

  const handleImages = (url) => {
    if (url.includes("https://drive.google.com")) {
      return `https://drive.google.com/thumbnail?id=${
        url.split("/d/").pop().split("/view?usp=sharing")[0]
      }`;
    } else {
      return url;
    }
  };

  function getSubcategoryDescription(obj, subcategoryName) {
    console.log("homepagesubcategory", obj[subcategoryName]?.[0]);
    const search = obj[subcategoryName]?.[0]?.description;

    return search;
  }

  /* console.log(Object.keys(subcategoriesDescriptions)); */
  return (
    <>
      <h6
        className="text-center sm-text pt-1 bg-warning px-2"
        data-tip={getSubcategoryDescription(
          subcategoriesDescriptions,
          subcategoryName
        )}
        data-for="subcategory-tooltip"
      >
        {subcategoryName} <br/>({filteredCategory.length})
      </h6>

      {/* <div className=""> */}
        <div className="homeCards px-2 ">
          {filteredCategory
            ? filteredCategory.map((row, index) => {
                return (
                  <div
                    href="https://nextjs.org/docs"
                    className="landscape-card  landscape-box-card mb-0 me-1 mt-0 "
                    key={index}
                    onClick={() => handleCompany(row)}
                  >
                    <div
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      data-tip={row.name}
                      data-for="companyName-tooltip"
                      className={
                        !withZoom
                          ? "landscape-img border "
                          : "homepage-landscape-img border "
                      }
                    >
                      {row.logo === "" || null ? (
                        <img
                          src={`../apidaysReplacementLogo.png`}
                          alt=""
                          className=""
                        />
                      ) : (
                        <img
                          srcSet={`${handleImages(row.logo)} 2x`}
                          alt=""
                          className=""
                        />
                      )}
                    </div>
                    {!withZoom ? (
                      <p className="index-company-text text-center mt-1">
                        {row.name.substr(0, 10)}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                );
              })
            : "no data"}
        </div>
      {/* </div> */}
      {/* MODAL */}

      {/* MODAL */}
    </>
  );
}
