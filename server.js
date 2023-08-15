//Import  Packges
const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
//Import Route file
const userRoute = require('./routes/user')
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Server PORT
const HTTP_PORT = 8080;

//Create Connection to the database
var db = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    password: "",
    port: 3306,
    database: "cafemanagement"
});

//Connect and Check error(Check Database Connection)
db.connect((err) => {
    if (!err) {
        console.log("Database Connected!");
    } else {
        console.log("Database Connection Failed!", err);

    }
});

//Create Server
app.listen(HTTP_PORT, () => {
    console.log(`Server is running on ${HTTP_PORT}`);

});


//=====================API OF Cafe Management System Server===================


//user  SignUp Route
app.post('/signup', (req, res) => {
    //Signup Form data assign in to the user Varibale
    let user = req.body;
    var sql = `SELECT user_ID,user_Name,user_Email,user_Password,user_Status,user_role,user_contacNumber FROM users WHERE user_Email=?`;
    //Query Execute
    db.query(sql, [user.user_Email], (err, results) => {
        if (!err) {
            //not error
            //Check that request email in our Database
            if (results.length <= 0) {
                //that email not in our database insert the value
                let sql = "INSERT INTO users( user_Name,user_Email,user_Password,user_Status,user_role,user_contacNumber) VALUES(?,?,?,'false','user',?)";
                //execute the Query
                db.query(sql, [user.user_Name, user.user_Email, user.user_Password, user.user_Status, user.user_role, user.user_contacNumber], (err, results) => {
                    //check inserting data error
                    //if not Error
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered!" })


                    } else {
                        //if has error
                        //send error with error msg and error code
                        return res.status(500).json(err);


                    }
                });

            } else {
                //that email in our database send the Error message
                res.send('That Email Already Exist');
            }

        } else {
            res.sendStatus(500).end();
        }
    });
});
