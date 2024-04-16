import Layout from "../layout.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { client } from "../utils/client.js";

// This function is used to find records in the database based on the filter and query provided
async function findRecords(filter, query, page) {
  const offset = page ? (page - 1) * 15 : 0
  if (filter === "name") {
    const data = await client.execute(`SELECT * FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%") LIMIT 15 OFFSET ${offset}`)
    return data
  } else {
    const data = await client.execute(`SELECT * FROM deed WHERE ${filter} LIKE '%${query}%' LIMIT 15 OFFSET ${offset}`)
    return data
  }
}

// This function is used to find the count of records in the database based on the filter and query provided
async function findCount(filter, query) {
  if (filter === "name") {
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%")`)
    return count
  } else {
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ${filter} LIKE '%${query}%'`)
    return count
  }
}

// Simple reusable button component to handle the pagination of the results table.
function PageButton({ content, handler }) {
  return (
    <button type="button" onClick={(e) => handler(e)} className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center mx-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">{content}</button>
  )
}

// Component to handle the filter and query input fields
function Filter({ filter, setFilter, query, setQuery }) {

  return (
    <>
      <select name="filter" id="filter" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-md px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-black-800 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" value={filter} onChange={(e) => setFilter(e.target.value)} required>
        <option value="">Select Option</option>
        <option value="SEC">Section</option>
        <option value="RGE">Range</option>
        <option value="BK">Book</option>
        <option value="BLK">Block</option>
        <option value="CITY">City</option>
        <option value="LOT">Lot</option>
        <option value="QTR">Quarter</option>
        <option value="TSP">Township</option>
        <option value="TYPE">Type</option>
        <option value="name">Name</option>
        <option value="'APPLICATION #'">Application #</option>
      </select>
      <input type="text" className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-md px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-black-800 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" name="query" id="query" value={query} onChange={(e) => setQuery(e.target.value)} required />
      <button type="submit" className="border border-gray-800 rounded-sm px-3 py-1 hover:bg-gray-600 text-gray-900 hover:text-white">Search</button>
    </>
  )
}

// main component
export default function Records() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);

  // handles submit on the form. It sets the loading state to true, sets the page to 1, finds the count of records based on the filter and query, finds the records based on the filter, query and page, and updates the url with the filter, query and page.
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setPage(1)
    findCount(filter, query).then(res => setCount(res.rows[0][0]))
    findRecords(filter, query, 1)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
    window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=1`)
  }

  // handles the page change. It sets the loading state to true, updates the url with the filter, query and page, and finds the records based on the filter, query and page.
  const handlePage = (e) => {
    setLoading(true)
    if (e.target.innerText === "<") {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=${page - 1}`)
      setPage(page - 1)
    } else if (e.target.innerText === ">") {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=${page + 1}`)
      setPage(parseInt(page) + 1)
    } else {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=${e.target.innerText}`)
      setPage(e.target.innerText)
    }

    findRecords(filter, query, page)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
  }

  // checks url for filter, query and page. If they exist, it finds the count of records based on the filter and query, and finds the records based on the filter, query and page.
  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const filter = params.get("filter")
      const query = params.get("query")
      const page = params.get("page")
      findCount(filter, query).then(res => setCount(res.rows[0][0]))
      findRecords(filter, query, page)
        .then(res => {
          setResults(res)
          console.log(res)
        })

      setFilter(filter)
      setQuery(query)
      setPage(parseInt(page))
    }
  }, [])


  return (
    <Layout>
      <div className="flex max-w-[95dvw]">
        <form onSubmit={e => handleSubmit(e)}>
          <Filter filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} />
        </form>
        <div className="flex flex-col align-middle justify-center ml-3">
          {results ? (
            <div>
              {(page === 1) ? null : <PageButton handler={handlePage} content="&lt;" />}
              {(page > 2) ? <PageButton handler={handlePage} content={1} /> : null}
              {(page > 3) ? <span className="mx-1">...</span> : null}
              {(page > 1) ? <PageButton handler={handlePage} content={page - 1} /> : null}
              <span className="mx-1">{page}</span>
              {(page < Math.ceil(count / 15)) ? <PageButton handler={handlePage} content={parseInt(page) + 1} /> : null}
              {(page < Math.ceil(count / 15) - 1) ? <span className="mx-1">...</span> : null}
              {(page < Math.ceil(count / 15)) ? <PageButton handler={handlePage} content={Math.ceil(count / 15)} /> : null}
              {(page === Math.ceil(count / 15)) ? null : <PageButton handler={handlePage} content="&gt;" />}
            </div>
          ) : null}

          <table>
            {loading ? <thead><tr><th>Loading...</th></tr></thead> : (
              <>
                <thead>
                  <tr>
                    {results ? results.columns.map(col => (
                      <th key={uuidv4()}>{col}</th>
                    )) : null}
                  </tr>
                </thead>
                <tbody>
                  {results ? results.rows.map(result => {
                    return (
                      <tr key={uuidv4()}>
                        {results.columns.map(col => (
                          <td key={uuidv4()}>{result[col]}</td>
                        ))}
                      </tr>
                    )
                  }) : <tr><td>No Data</td></tr>}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </Layout>
  );
}
