import { createClient } from "@libsql/client";

export const client = createClient({
  url: import.meta.env.VITE_DB_URI,
  authToken: import.meta.env.VITE_DB_TOKEN,
});

function genQuery(name, appId, filters) {
  const queryArray = []
  if (name) {
    queryArray.push(`("LAST NAME GRANTOR_1" LIKE "%${name}%" OR "FIRST NAME GRANTOR_1" LIKE "%${name}%" OR "LAST NAME GRANTOR_2" LIKE "%${name}%" OR "FIRST NAME GRANTOR_2" LIKE "%${name}%" OR "LAST NAME GRANTOR 3" LIKE "%${name}%" OR "FIRST NAME GRANTOR 3" LIKE "%${name}%" OR "LAST NAME GRANTEE_1" LIKE "%${name}%" OR "FIRST NAME GRANTEE_1" LIKE "%${name}%" OR "LAST NAME GRANTEE_1" LIKE "%${name}%" OR "FIRST NAME GRANTEE_1" LIKE "%${name}%" OR "LAST NAME GRANTEE_2" LIKE "%${name}%" OR "FIRST NAME GRANTEE_2" LIKE "%${name}%")`)
  }
  if (appId) {
    queryArray.push(`APPLICATION LIKE "%${appId}%"`)
  }
  if (filters) {
    const filterArray = []
    filters.forEach(filter => {
      if (filter.data.length > 0) {
        const typeArray = []
        filter.data.forEach(data => {
          typeArray.push(`${filter.filter} LIKE "${data}"`)
        })
        filterArray.push("(" + typeArray.join(" OR ") + ")")
      }
    })
    queryArray.push(filterArray.join(" AND "))
  }
  const fixedQueryArray = queryArray.filter(query => query.length > 0)
  return fixedQueryArray.join(" AND ")
}

// This function is used to find records in the database based on the filter and query provided

export async function findRecords(name, appId, filters, page) {
  const offset = page ? (page - 1) * 15 : 0
  console.log(`SELECT * FROM DEED WHERE ${genQuery(name, appId, filters)} LIMIT 15 OFFSET ${offset}`)
  const data = await client.execute(`SELECT * FROM DEED WHERE ${genQuery(name, appId, filters)} LIMIT 15 OFFSET ${offset}`)
  return data
}

export async function findCount(name, appId, filters) {
  const data = await client.execute(`SELECT COUNT(*) FROM DEED WHERE ${genQuery(name, appId, filters)}`)
  return data
}

// export async function findRecords(filter, query, page) {
//   const offset = page ? (page - 1) * 15 : 0
//   if (filter === "name") {
//     const data = await client.execute(`SELECT * FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%") LIMIT 15 OFFSET ${offset}`)
//     return data
//   } else {
//     const data = await client.execute(`SELECT * FROM deed WHERE ${filter} LIKE '%${query}%' LIMIT 15 OFFSET ${offset}`)
//     return data
//   }
// }

// This function is used to find the count of records in the database based on the filter and query provided
// export async function findCount(filter, query) {
//   if (filter === "name") {
//     const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ("LAST NAME GRANTOR_1" LIKE "%${query}%" OR "FIRST NAME GRANTOR_1" LIKE "%${query}%" OR "LAST NAME GRANTOR_2" LIKE "%${query}%" OR "FIRST NAME GRANTOR_2" LIKE "%${query}%" OR "LAST NAME GRANTOR 3" LIKE "%${query}%" OR "FIRST NAME GRANTOR 3" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_1" LIKE "%${query}%" OR "FIRST NAME GRANTEE_1" LIKE "%${query}%" OR "LAST NAME GRANTEE_2" LIKE "%${query}%" OR "FIRST NAME GRANTEE_2" LIKE "%${query}%")`)
//     return count
//   } else {
//     const count = await client.execute(`SELECT COUNT(*) FROM deed WHERE ${filter} LIKE '%${query}%'`)
//     return count
//   }
// }

