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
  return getAllProperties(null, 2);
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
  const poolResult = pool.query("select * from properties limit $1", [limit]).then((result) => {
    return result.rows;
  })
    .catch((err) => {
      console.log(err.message);
    });
  return poolResult;
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
