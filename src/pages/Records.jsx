import Layout from "../layout.jsx";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { client } from "../utils/client.js";

async function findRecords(filter, query, page) {
  const offset = page ? (page - 1) * 15 : 0
  if (filter === "name") {
    const data = await client.execute(`SELECT * FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%") LIMIT 15 OFFSET ${offset}`)
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%")`)
    return data
  } else {
    const data = await client.execute(`SELECT * FROM deed WHERE ${filter} LIKE '%${query}%' LIMIT 15 OFFSET ${offset}`)
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ${filter} LIKE '%${query}%'`)
    return data
  }
}

async function findCount(filter, query) {
  if (filter === "name") {
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%")`)
    return count
  } else {
    const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ${filter} LIKE '%${query}%'`)
    return count
  }
}

export default function Records() {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('');
  const [query, setQuery] = useState('');
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setPage(1)
    const newCount = findCount(filter, query).then(res => setCount(res.rows[0][0]))
    const response = findRecords(filter, query, 1)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
    window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=1`)
  }
  const handlePage = (e) => {
    setLoading(true)
    if (e.target.innerText === "<") {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=${page - 1}`)
      setPage(page - 1)
    } else {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + `?filter=${filter}&query=${query}&page=${page + 1}`)
      setPage(page + 1)
    }
    const response = findRecords(filter, query, page)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
  }

  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const filter = params.get("filter")
      const query = params.get("query")
      const page = params.get("page")
      findCount(filter, query).then(res => setCount(res.rows[0][0]))
      const results = findRecords(filter, query, page)
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
      <form onSubmit={e => handleSubmit(e)}>
        <select name="filter" id="filter" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-md px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-black-800 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" value={filter} onChange={(e) => setFilter(e.target.value)}>
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
        <input type="text" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-md px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-black-800 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800" name="query" id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="submit" >Search</button>
      </form>
      {results ? (
        <div>
          {(page === 1) ? null : <button onClick={(e) => handlePage(e)} type="button" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">&lt;</button>}
          {page}
          {(page === Math.ceil(count / 15)) ? null : <button onClick={(e) => handlePage(e)} type="button" class="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">&gt;</button>}
          of {Math.ceil(count / 15)}</div>
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
    </Layout>
  );
}
