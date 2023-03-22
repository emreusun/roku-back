const express = require('express');
const router = express.Router();

// improt the sql package
const sql = require('mysql');
const creds = require('../config/user');

// create a pool of potentioal connections and use the
// sql user credentials to connect to your instanste of mysql
// on your machine
const pool = sql.createPool(creds);


router.get('/', (req, res) => {
    res.json({message:'hit ums API root'});
})

// try to authenticate a user via login route
router.post('/login', (req, res) => {
  console.log('hit the login route');
  console.log('user data', req.body);

  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    connection.query(`SELECT username, password FROM users WHERE username="${req.body.username}"`, function(error, results) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;

      let result = {message: ''}

      // what if the user doesn't exist? no username
      if (results.length ==0 ){
        // no matching username ... maybe proive a sign up from / button?
        result.message = "no user";
      } else if (results[0].password !== req.body.password) {
        // no matching username ... mark the password field on the client side
        result.message = "wrong password";
      } else {
        // erorr checks all passed, so we have a valid user
        result.message = "success";
        result.user = results[0]; // pass the user data back to the Roku app
      };
   
      // Don't use the connection here, it has been returned to the pool.
      //res.json({message:'hit ums users root'});
      res.json(result);
    });
  });

  
})

//retrieve all users from a database
router.get('/users', (req, res) => {
    // console.log(req.params.user);
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query('SELECT * FROM users', function(error, results) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;

          results.forEach(user => {
            // sanitize our data a bit = get rid of stuff shouldn't be puclic
            delete user.password;
            delete user.fname;
            delete user.lname;

            // if here's not atars, set a default
            if (!user.avatar) {
              user.avatar = "temp_avatar.jpg";
            }
          })
       
          // Don't use the connection here, it has been returned to the pool.
          //res.json({message:'hit ums users root'});
          res.json(results);
        });
      });
})

// retrieve one user from a database based on thet user's ID or another field
router.get('/users/:user', (req, res) => {
    // res.json({message:'hit single user route'});
    console.log(req.params.user);
    pool.getConnection(function(err, connection) {
        if (err) throw err; // not connected!
       
        // Use the connection
        connection.query(`SELECT * FROM users WHERE id=${req.params.user}`, function (error, results) {
          // When done with the connection, release it.
          connection.release();
       
          // Handle error after the release.
          if (error) throw error;

          // remove any sensitive info from the dataset(s)
          delete results[0].password;
          delete results[0].fname;
          delete results[0].lname;

          // add a temp avatar if there is'nt one
          if (results[0].avatar == null) {
            results[0].avatar = "ava-1.jpg";
            }
       
          console.log(results);

          // Don't use the connection here, it has been returned to the pool.
          //res.json({message:'hit ums users root'});
          res.json(results);
        });
      });
})

module.exports = router;
