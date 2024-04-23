import Layout from "../layout.jsx";
import './Records.css';
import { useState, useEffect } from "react";
import { distinct } from "../components/distinct.js";
import { v4 as uuidv4 } from "uuid";
import { findCount, findRecords } from "../utils/client.js";


// Simple reusable button component to handle the pagination of the results table.
function PageButton({ content, handler }) {
  return (
    <button type="button" onClick={(e) => handler(e)} className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center mx-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800">{content}</button>
  )
}

function Search({ type, value, setValue }) {
  return (
    <div>
      <label htmlFor={type}>{type}</label>
      <input
        type="text"
        name={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="border border-gray-800 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center mx-2 mb-2"
      />
    </div>
  )
}

// Component to handle the filter and query input fields
function Filter({ filter, filterList, updateFilterList }) {
  const [checkedState, setCheckedState] = useState(new Array(filter.data.length).fill(false))
  const [showMore, setShowMore] = useState(false)

  const handleCheckboxChange = (position) => {
    const updatedCheckedState = checkedState.map((item, index) =>
      index === position ? !item : item
    );
    setCheckedState(updatedCheckedState);
  }

  const handleShowMore = (e, show) => {
    e.preventDefault()
    setShowMore(show)
  }

  useEffect(() => {
    const checked = {
      filter: filter.filter,
      data: checkedState.map((item, index) => item ? filter.data[index] : null).filter(item => item !== null)
    }
    updateFilterList([...filterList].filter(item => item.filter !== filter.filter).concat(checked))

  }, [checkedState])

  return (
    <>
      <ul>
        <span className="font-bold">{filter.name}</span>
        {showMore ? (
          <>
            {
              filter.data.map((option, index) => (
                <li key={option + "-" + index}>
                  <input
                    type="checkbox"
                    name={filter.name + option}
                    value={option}
                    checked={checkedState[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label htmlFor={filter.name + option}>{option}</label>
                </li>
              ))
            }
            <li>
              <button onClick={(e) => handleShowMore(e, false)} className="text-blue-600 text-sm hover:underline">^Show Less</button>
            </li>
          </>
        ) : (
          <>
            {
              filter.data.slice(0, 5).map((option, index) => (
                <li key={option + "-" + index}>
                  <input
                    type="checkbox"
                    name={filter.name + option}
                    value={option}
                    checked={checkedState[index]}
                    onChange={() => handleCheckboxChange(index)}
                  />
                  <label htmlFor={filter.name + option}>{option}</label>
                </li>
              ))
            }
            <li>
              <button onClick={(e) => handleShowMore(e, true)} className="text-blue-600 text-sm hover:underline">&gt;Show More</button>
            </li>
          </>
        )}
      </ul>
    </>
  )
}

// main component
export default function Records() {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(new Array())
  const [name, setName] = useState("")
  const [appId, setAppId] = useState("")
  const [count, setCount] = useState(null);
  const [page, setPage] = useState(1);
  const [results, setResults] = useState(null);

  // handles submit on the form. It sets the loading state to true, sets the page to 1, finds the count of records based on the filter and query, finds the records based on the filter, query and page, and updates the url with the filter, query and page.
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setPage(1)
    findCount(name, appId, filters).then(res => setCount(res.rows[0][0]))
    findRecords(name, appId, filters, 1)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
    const queryArray = []
    if (name !== "") {
      queryArray.push(`name=${name}`)
    }
    if (appId !== "") {
      queryArray.push(`&appId=${appId}`)
    }
    if (filters.length > 0) {
      queryArray.push(`${filters.map(filter => {
        if (filter.data.length > 0) {
          return `${filter.filter}=${filter.data}`
        }
      }).join("&")}`)
    }
    const queryString = queryArray.join("&")
    window.history.pushState({}, "", window.location.origin + window.location.pathname + "?" + queryString + `&page=${page}`)
  }

  // handles the page change. It sets the loading state to true, updates the url with the filter, query and page, and finds the records based on the filter, query and page.
  const handlePage = (e) => {
    setLoading(true)
    const queryArray = []
    if (name !== "") {
      queryArray.push(`name=${name}`)
    }
    if (appId !== "") {
      queryArray.push(`&appId=${appId}`)
    }
    if (filters.length > 0) {
      queryArray.push(`${filters.map(filter => {
        if (filter.data.length > 0) {
          return `${filter.filter}=${filter.data}`
        }
      }).join("&")}`)
    }
    const queryString = queryArray.join("&")
    if (e.target.innerText === "<") {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + queryString + `&page=${page - 1}`)
      setPage(parseInt(page) - 1)
    } else if (e.target.innerText === ">") {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + queryString + `&page=${page + 1}`)
      setPage(parseInt(page) + 1)
    } else {
      window.history.pushState({}, "", window.location.origin + window.location.pathname + queryString + `&page=${e.target.innerText}`)
      setPage(e.target.innerText)
    }

    findRecords(name, appId, filters, page)
      .then(res => {
        setResults(res)
        setLoading(false)
      })
  }

  useEffect(() => {
    // console.log(filters)
  }, [filters])

  // checks url for filter, query and page. If they exist, it finds the count of records based on the filter and query, and finds the records based on the filter, query and page.
  useEffect(() => {
    if (window.location.search) {
      const params = new URLSearchParams(window.location.search)
      const localName = params.get("name")
      const localAppId = params.get("appId")
      const filterArray = distinct.map(filter => {
        if (params.get(filter.filter) !== null) {
          const filterData = {
            filter: filter.filter,
            data: params.get(filter.filter).split(',')
          }
          return filterData
        }
      })
      const localFilters = filterArray.filter(item => item)
      console.log(filters)
      const page = parseInt(params.get("page"))
      localName && setName(localName)
      localAppId && setAppId(localAppId)
      localFilters && setFilters(localFilters)
      findCount(localName, localAppId, localFilters).then(res => setCount(res.rows[0][0]))
      findRecords(localName, localAppId, localFilters, page)
        .then(res => {
          setResults(res)
          console.log(res)
        })

      setPage(parseInt(page))
    }
  }, [])


  return (
    <Layout>
      <div className="flex max-w-[95dvw] pt-1">
        <form onSubmit={e => handleSubmit(e)} className="max-w-[20dvw]">
          <span className="font-bold text-lg">
            Search by:
          </span>
          <Search type="Name" value={name} setValue={setName} />
          <span className="font-bold text-lg">
            --OR--
          </span>
          <Search type="Application ID" value={appId} setValue={setAppId} />
          <input type="button" value="Search" onClick={e => handleSubmit(e)} className="text-black hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center mx-2 mb-2" />
          <div className="font-bold text-lg">
            Filters:
          </div>
          <div className="max-h-[50dvh] overflow-y-auto">
            {distinct.map((item, index) => (
              <Filter
                filter={item}
                filterList={filters}
                updateFilterList={setFilters}
                key={index} />
            ))}
          </div>
          <input type="button" value="Apply Filter" onClick={e => handleSubmit(e)} className="text-black hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-1 focus:outline-none focus:ring-gray-300 font-medium rounded-sm text-sm px-3 py-1 text-center mx-2 mb-2" />
        </form>
        <div className="flex flex-col items-center justify-center ml-3">
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
