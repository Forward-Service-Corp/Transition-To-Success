import Layout from "../components/layout";
import { getSession } from "next-auth/react";
import { useState } from "react";
import Head from "next/head";
import ServicesTable from "../components/servicesTable";
import { WICountiesList } from "../lib/WI_Counties";
import { labelMap } from "../lib/serviceLabelsMap";
import { canUserManageServices } from "../lib/servicePermissions";
import { useRouter } from "next/router";
import type { NextPageContext } from "next";
import type { DirectoryResponse } from "./api/pages/directoryPageData";
import ServiceEditModal from "../components/serviceEditModal";
import Select, { type MultiValue } from "react-select";

export default function Directory({
  pageDataJson,
}: {
  pageDataJson: DirectoryResponse;
}) {
  const router = useRouter();
  const [loadedServices, setLoadedServices] = useState(
    pageDataJson.directory ? pageDataJson.directory : [],
  );
  const [searched, setSearched] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchDomains, setSearchDomains] = useState<string[]>([]);
  const [searchCounties, setSearchCounties] = useState<string[]>([]);
  const [searching, setSearching] = useState(false);
  const [addingService, setAddingService] = useState(false);
  const domains = Object.values(labelMap);

  const user = pageDataJson.user;
  const canManage = user ? canUserManageServices(user) : false;

  async function search() {
    setSearching(true);
    // Convert "none" to empty string for API

    const fetchSearch = await fetch("/api/search-directory", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        keyword: searchKeyword,
        domains: searchDomains,
        counties: searchCounties,
      }),
    }).then((res) => res.json());

    setSearching(false);
    //console.log(fetchSearch.records);
    setLoadedServices(fetchSearch.records || []);
  }

  const handleSave = () => {
    window.location.reload();

    setAddingService(false);
  };

  const handleDomainChange = (
    selected: MultiValue<{ value: string; label: string }>,
  ) => {
    setSearchDomains(selected ? selected.map((item) => item.value) : []);
  };
  const handleCountyChange = (
    selected: MultiValue<{ value: string; label: string }>,
  ) => {
    setSearchCounties(selected ? selected.map((item) => item.value) : []);
  };

  const generatePlaceholder = (values: string[]) => {
    if (values.length == 0) return "";
    if (values.length > 3) {
      return [...values.slice(0, 2), `and ${values.length - 2} more`].join(
        ", ",
      );
    }
    return values.join(", ");
  };

  return (
    <Layout title={"CARE Network"} user={pageDataJson.user}>
      <Head>
        <title>TTS / CARE Network</title>
      </Head>
      <div
        className={
          "w-full max-w-[95%] m-auto p-3 bg-gray-100 rounded shadow dark:bg-transparent"
        }
      >
        <form
          className={"grid grid-cols-1 md:grid-cols-4 gap-4 items-end"}
          onSubmit={(e) => {
            e.preventDefault();
            search().then();
            // console.log(domain,county)
          }}
        >
          <div className={""}>
            <p className={"text-xs text-gray-500 dark:text-white dark:pb-3"}>
              Search by keyword
            </p>
            <input
              className={
                " p-2.5 w-full rounded border-gray-300 text-xs dark:bg-black dark:text-white dark:border-0 dark:placeholder:text-gray-500"
              }
              placeholder={`Enter a keyword...`}
              id={"searchField"}
              type={"text"}
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
            />
          </div>
          <div className={""}>
            <p className={"text-xs text-gray-500 dark:text-white dark:pb-3"}>
              Search by domain
            </p>
            <Select
              className="count-select"
              options={domains.map((domain) => ({
                value: domain,
                label: domain,
              }))}
              isMulti
              closeMenuOnSelect={false}
              isClearable={true}
              onChange={handleDomainChange}
              placeholder={
                generatePlaceholder(searchDomains) || "Select domains..."
              }
              hideSelectedOptions={false}
              controlShouldRenderValue={false}
              classNames={{
                menu: () => "text-xs",
                input: () => "text-xs",
                placeholder: () =>
                  searchDomains.length > 0 ? "text-xs !text-black" : "text-xs",
              }}
              styles={{
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#fb923c" : undefined,
                  color: "black",
                }),
              }}
            />
          </div>
          <div className={""}>
            <p
              className={
                "text-xs text-gray-500 dark:text-white dark:pb-3 bg-or"
              }
            >
              Search by county
            </p>
            <Select
              className="count-select"
              options={WICountiesList.map((county) => ({
                value: county,
                label: county,
              }))}
              isMulti
              closeMenuOnSelect={false}
              isClearable={true}
              onChange={handleCountyChange}
              controlShouldRenderValue={false}
              hideSelectedOptions={false}
              placeholder={
                generatePlaceholder(searchCounties) || "Select Counties"
              }
              classNames={{
                menu: () => "text-xs",
                input: () => "text-xs",
                placeholder: () =>
                  searchCounties.length > 0 ? "text-xs !text-black" : "text-xs",
              }}
              styles={{
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isSelected ? "#fb923c" : undefined,
                  color: "black",
                }),
              }}
            />
          </div>
          <div className={"flex items-center"}>
            <button
              type={"submit"}
              className={
                "py-[8px] px-6 mr-2 text-white  text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 rounded-lg"
              }
              disabled={
                searchKeyword === "" &&
                searchDomains.length == 0 &&
                searchCounties.length == 0
              }
              onClick={() => {
                setSearched(true);
              }}
            >
              Search
            </button>
            <button
              type={"reset"}
              className={
                "py-[8px] px-6 text-white  text-xs bg-red-500 hover:bg-red-600 disabled:bg-gray-400 rounded-lg"
              }
              disabled={
                searchKeyword === "" &&
                searchDomains.length == 0 &&
                searchCounties.length == 0
              }
              onClick={() => {
                setSearchKeyword("");
                setSearchDomains([]);
                setSearchCounties([]);
                setLoadedServices([]);
                setSearched(false);
                setSearching(false);
                //console.log(domain,county)
              }}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
      <div
        className={`rounded bg-green-100 p-2 text-xs text-center mt-4 max-w-[95%] m-auto ${
          searching ? "visible" : "hidden"
        } dark:bg-purple-800 dark:text-white dark:font-extralight`}
      >
        Searching...
      </div>
      <div
        className={`text-center p-4 ${
          searched ? "visible" : "hidden"
        } dark:text-white dark:font-extralight`}
      >
        {loadedServices.length === 0
          ? "There were no results"
          : "There were " + loadedServices.length + " results found."}
      </div>
      <div
        className={`text-center p-4 ${
          !searched ? "visible" : "hidden"
        } dark:text-white font-thin`}
      >
        Please enter your search criteria.
      </div>
      {canManage && (
        <div className="w-full max-w-[95%] m-auto p-3 mb-4">
          <button
            onClick={() => setAddingService(true)}
            className="py-[8px] px-6 text-white text-xs bg-green-500 hover:bg-green-600 rounded-lg dark:bg-green-600 dark:hover:bg-green-700"
          >
            Add New Service
          </button>
        </div>
      )}
      {loadedServices.length > 0 ? (
        <ServicesTable
          services={loadedServices}
          canManageServices={canManage}
        />
      ) : null}
      <ServiceEditModal
        isOpen={addingService}
        onClose={() => {
          setAddingService(false);
        }}
        onSave={handleSave}
      />
    </Layout>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  //   if (!session)
  //     return { redirect: { destination: "/login", permanent: false } };
  const { req } = context;

  const protocol = req?.headers?.["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  //const tempID = session ? session.user._id : 'guest'
  // page data
  const pageDataUrl =
    baseUrl +
    "/api/pages/directoryPageData" +
    (session ? "?userId=" + session.user._id : "");
  const getPageData = await fetch(pageDataUrl);
  const pageDataJson: DirectoryResponse = await getPageData.json();

  // redirect to profile page if required fields are not complete
  // const {county, name, homeCounty, programs} = pageDataJson.user
  // if(!county.length || !homeCounty || !programs.length || !name) return  {redirect: {destination: "/profile", permanent: false}}

  return {
    props: { pageDataJson },
  };
}
