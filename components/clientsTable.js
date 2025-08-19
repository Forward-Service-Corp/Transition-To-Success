import Link from "next/link";
import { ArrowCircleRight } from "phosphor-react";

export default function ClientsTable({ users, coach }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState(users);
  const [searched, setSearched] = useState(false);
  const d1 =
    "A list of the 100 most recently added users to this TTS database.";
  const d2 =
    "Your search should be based on the email address used to create the account";
  const d3 =
    ", because many of the other fields are not required for account creation.";
  const defaultMessage = `${d1} <strong>${d2}</strong>${d3}`;
  const s1 = `This is a list of all the users whose email address contains <strong>your searched criteria of ${searchTerm}</strong>.`;
  const s2 = `There were ${usersData.length} found.`;
  const searchedMessage = `${s1} ${s2}`;
  const handleSearch = async (e) => {
    e.preventDefault();
    await fetch("api/get-client-search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchTerm: searchTerm,
        coach: coach,
      }),
    })
      .then((response) => response.json())
      .then((data) => setUsersData(data))
      .then(() => setSearched(true))
      .catch((error) => console.error("Error:", error));
  };
  const resetSearch = () => {
    setSearchTerm("");
    setUsersData(users);
    setSearched(false);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row items-center lg:justify-between lg:items-center">
        <div className="w-full mb-6 mr-0 lg:mr-6 lg:mb-0 lg:flex-1">
          <h1 className="text-xl font-semibold text-gray-900">Your Clients</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-white dark:font-extralight">
            A list of all the clients you manage.
          </p>
          <p
            className="mt-2 text-sm text-gray-700"
            dangerouslySetInnerHTML={{
              __html: !searched ? defaultMessage : searchedMessage,
            }}
          />
        </div>
      </div>

      <div className={"w-full lg:w-[350px] lg:justify-items-end"}>
        <form onSubmit={handleSearch} className={`grid grid-cols-5 gap-1`}>
          <input
            type="text"
            id={"search-users"}
            className={"border-gray-300 text-xs col-span-3"}
            value={searchTerm}
            autoComplete="false"
            placeholder={"Search users by email or phone number..."}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
          <button
            type="submit"
            disabled={searchTerm === ""}
            className={`bg-green-500 disabled:bg-gray-300 text-white py-1 text-xs font-extralight rounded col-span-1`}
          >
            Submit
          </button>
          <button
            type="reset"
            disabled={searchTerm === ""}
            className={`bg-blue-500 disabled:bg-gray-300 text-white py-1 text-xs font-extralight rounded col-span-1`}
            onClick={resetSearch}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-opacity-20 table-auto">
                <thead className="bg-gray-50 dark:bg-black dark:text-white">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-white"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6 dark:text-white"
                    >
                      <span className="sr-only">View</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:bg-black dark:bg-opacity-10 dark:divide-opacity-[3%]">
                  {usersData && usersData.map((person) => (
                    <tr
                      key={person.email}
                      className={`dark:hover:bg-indigo-800 dark:hover:bg-opacity-10`}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 dark:text-white">
                        {person.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 dark:font-extralight">
                        {person.phone}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300 dark:font-extralight">
                        {person.email}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link href={"/client/" + person._id}>
                          <ArrowCircleRight size={26} />
                          <span className="sr-only">, {person.name}</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
