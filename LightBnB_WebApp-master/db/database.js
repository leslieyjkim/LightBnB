// this is loading data from json file instead of Database
// what we are trying to do would be
// 1. replace this json dummy data with actual postgres DataBase

const properties = require("./json/properties.json");
const users = require("./json/users.json");


// pg implementation - see "https://web.compass.lighthouselabs.ca/c1dea2b9-59b5-440d-984b-48fb48826553"
// make sure if you already installed pg -> npm install pg
// how to check your user/password config against postgres
// 1. at terminal, psql -U <yourusername> -d <yourdatabase> => can you go in postgres interactive mode ?
// 2. SELECT usename AS username, passwd AS password FROM pg_shadow WHERE usename = '<yourusername>';
// -> you can see your username and hashed password
// you can confirm whether the given connectionConfig has valid config by running codes below
// pool.query(`SELECT title FROM properties LIMIT 10;`).then(response => {console.log(response)}) at the interactive mode of node
// [how to do local test with database.js]
// type node -> come to interactive mode
// const database = require("./db/database");
// database.<yourfuction>(....)


// !!! npm start should be at LightBnB_WebApp-master directory because of package.json location. !!!
const {Pool} = require('pg');
const connectionConfig = {
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'};
const pool = new Pool(connectionConfig);

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
// [assignment]
// Accepts an email address and will return a promise.
// The promise should resolve with a user object with the given email address, or null if that user does not exist.
// [how to test]
// original test instruction:
// Test that getUserWithEmail is working by trying to login as an existing user in the database.
// (Recall that every user's password is "password", not the hashed version you see in the database.)
// 1. npm start -> you can see "localhost:3000" or something like that
// 2. test user email = tristanjacobs@gmail.com, password = password
// DO NOT use this hashed password from your query , this is hashed value of "password" : $2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.
// 3. if post-login page is shown, your getUserWithEmail is working
  let searchByEmailQry = "SELECT * FROM users where email = $1";
  const firstRowIndex = 0;
  let promiseUser = pool.query(searchByEmailQry, [email.toLowerCase()]).then(function(result) {
    if (result.rows.length > 0) {
      return result.rows[firstRowIndex];
    } else {
      return null;
    }
    
  }).catch((err) => {
    console.log(err.message);
  });
  return promiseUser;
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
// [assignment]
// Will do the same as getUserWithEmail, but using the user's id instead of email.
// [test instruction]
// Test that getUserWithId is working by refreshing the page while logged in. If you stay logged in, then this function is working.
  let searchByUserIDQry = "SELECT * FROM users where id = $1";
  const firstRowIndex = 0;
  let promiseUser = pool.query(searchByUserIDQry, [id]).then(function(result) {
    if (result.rows.length > 0) {
      return result.rows[firstRowIndex];
    } else {
      return null;
    }
    
  }).catch((err) => {
    console.log(err.message);
  });
  return promiseUser;
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
// [assignment]
// Accepts a user object that will have a name, email, and password property
// This function should insert the new user into the database.
// It will return a promise that resolves with the new user object.
// This object should contain the user's id after it's been added to the database.
// Add RETURNING *; to the end of an INSERT query to return the objects that were inserted.
// This is handy when you need the auto generated id of an object you've just added to the database.
  let insertNewUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;";
  const firstRowIndex = 0;
  let promiseUser = pool.query(insertNewUser, [user.name, user.email, user.password]).then(function(result) {
    if (result.rows.length > 0) {
      return result.rows[firstRowIndex];
    } else {
      return null;
    }
    
  }).catch((err) => {
    console.log(err.message);
  });
  return promiseUser;
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
// [assignment]
// Update the getAllReservations function to use the lightbnb database to return reservations associated with a specific user.
// This function accepts a guest_id, limits the properties to 10 and returns a promise.
// The promise should resolve reservations for that user.
// Tip: Copy the query you built in LightBnB Select to use as a starting point,
// but alter it so that all necessary data is returned to render reservations correctly on the front end.
// write query -> see this schema relationship at https://web.compass.lighthouselabs.ca/p/4/days/w05d3/activities/954
// [test]
// user email: victoriaellis@hotmail.com, passwrod -> should show more than 2 at my reservation
  let allReservationQry = `
  SELECT 
  a.* 
  FROM 
  properties as a 
  INNER JOIN 
  (
    SELECT 
    property_id 
    FROM 
    reservations
     WHERE 
     guest_id = $1 
     ORDER BY 
     start_date 
     DESC 
     limit $2
  ) as b 
  ON a.id =b.property_id`;
  let reservations = pool.query(allReservationQry, [guest_id, limit]).then(function(result) {
    if (result.rows.length > 0) {
      return result.rows;
    } else {
      return null;
    }
  }).catch((err) => {
    console.log(err.message);
  });
  return reservations;
};

/// Properties
// THIS IS ACTUAL Refactoring target function.
/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // this is first implementation with pool
  // const poolResult = pool.query("select * from properties limit $1", [limit]).then((result) => {
  //   return result.rows;
  // })
  //   .catch((err) => {
  //     console.log(err.message);
  //   });
  // return poolResult;


  // [assignment]
  // We already refactored getAllProperties in the LightBnB Web Boilerplate activity to query our lightbnb database.
  // Now, we'll need to make some adjustments to it to return more data and allow filtering by the end user.
  // ............. 3 more filters ........
  // if an owner_id is passed in, only return properties belonging to that owner.
  // if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range. (HINT: The database stores amounts in cents, not dollars!)
  // if a minimum_rating is passed in, only return properties with an average rating equal to or higher than that.

  // HERE below example code regarding search by city

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_id
    `;
  
  let whereStrings = [];

  // 3
  if (options.city) {
    whereStrings.push(` LOWER(city) LIKE '%${options.city.toLowerCase()}%' `);
  }

  // owner_id
  if (options.owner_id) {
    whereStrings.push(` properties.owner_id = ${options.owner_id} `);
  }

  // minimum_price_per_night & maximum_price_per_night
  if (options.minimum_price_per_night) {
    whereStrings.push(` properties.cost_per_night >= ${options.minimum_price_per_night} `);
  }
  if (options.maximum_price_per_night) {
    whereStrings.push(` properties.cost_per_night <= ${options.maximum_price_per_night} `);
  }

  //minimum_rating
  if (options.minimum_rating) {
    whereStrings.push(` property_reviews.rating >= ${options.minimum_rating} `);
  }

  if (whereStrings.length > 0) {
    queryString += " where ";
    queryString += whereStrings.join(" AND ");
  }
  // 4
  queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT ${limit};
    `;
  
  // 5
  console.log(queryString);
  
  // 6
  return pool.query(queryString).then((res) => res.rows);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
// [assignment]
// Update this function to save a new property to the properties table.
// property object
// {
//   owner_id: int,
//   title: string,
//   description: string,
//   thumbnail_photo_url: string,
//   cover_photo_url: string,
//   cost_per_night: string,
//   street: string,
//   city: string,
//   province: string,
//   post_code: string,
//   country: string,
//   parking_spaces: int,
//   number_of_bathrooms: int,
//   number_of_bedrooms: int
// }
// insert then returning *
  let columns = ["owner_id", "title", "description", "thumbnail_photo_url", "cover_photo_url", "cost_per_night", "street", "city",
    "province", "post_code", "country", "parking_spaces", "number_of_bathrooms", "number_of_bedrooms"];
  let concatColumns = columns.join(", ");
  let valuePlaceholders = Array.from({ length: columns.length - 1 + 1 }, (_, i) => 1 + i).map(function(x) {
    return "$" + x;
  }).join(", ");
  let insertNewProperty = `INSERT 
                          INTO 
                          properties 
                          (${concatColumns})
                          VALUES 
                          (${valuePlaceholders}) 
                          RETURNING *;`;
  const firstRowIndex = 0;
  let promiseProperty = pool.query(insertNewProperty, columns.map(function(x) {
    return property[x];
  })).then(function(result) {
    if (result.rows.length > 0) {
      return result.rows[firstRowIndex];
    } else {
      return null;
    }
  
  }).catch((err) => {
    console.log(err.message);
  });
  return promiseProperty;
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
