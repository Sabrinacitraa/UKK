//import auth
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "eyosab"
const { isRole } = require("../auth")

//import library
const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('md5');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const user = model.user

//endpoint menampilkan semua data user, method: GET, function: findAll()
app.get("/", isRole(["admin"]), async (req,res) => {
    user.findAll()
        .then(result => {
            res.json({
                user : result,
                count : result.length
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//menampilkan data user berdasarkan id
app.get("/:id_user", isRole(["admin"]), async (req, res) =>{
    user.findOne({ where: {id_user: req.params.id_user}})
    .then(result => {
        res.json({
            user: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//endpoint untuk menyimpan data user, METHOD: POST, function: create
app.post("/", isRole(["admin"]), async (req,res) => {
    let data = {
        nama_user : req.body.nama_user,
        role : req.body.role,
        username : req.body.username,
        password : md5(req.body.password)
    }

    //input validation buat selain 3 role datanya tidak bisa ditambahkan
    const validRoles = ["admin", "kasir", "manajer"];
    if (!validRoles.includes(data.role)) {
        res.json({
            message: "Role tidak sesuai"
        })
    } else {
        //input validation buat username yang sudah ada di database
        let result = await user.findOne({ where: { username: data.username } });
        if (result) {
            res.json({
                message: "Username sudah tersedia"
            })
        } else {
            user.create(data)
                .then(result => {
                    res.json({
                        message: "data has been inserted"
                    })
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    })
                })
        }
    }
})

//endpoint mengupdate data user, METHOD: PUT, function:update
app.put("/:id", isRole(["admin"]), async (req,res) => {
    let param = {
        id_user : req.params.id
    }
    let data = {
        nama_user : req.body.nama_user,
        role : req.body.role,
        username : req.body.username,
        password : md5(req.body.password)
    }
    user.update(data, {where: param})
        .then(result => {
            res.json({
                message: "data has been updated"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//endpoint menghapus data user, METHOD: DELETE, function: destroy
app.delete("/:id", isRole(["admin"]), async (req,res) => {
    let param = {
        id_user : req.params.id
    }
    user.destroy({where: param})
        .then(result => {
            res.json({
                message: "data has been deleted"
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//login
app.post("/auth", async (req,res) => {
    let params = {
        username: req.body.username,
        password: md5(req.body.password)
    }

    let result = await user.findOne({where: params})
    if(result){
        let payload = JSON.stringify(result)
        // generate token
        let token = jwt.sign(payload, SECRET_KEY)
        res.json({
            logged: true,
            data: result,
            token: token
        })
    }else{
        res.json({
            logged: false,
            message: "Invalid username or password"
        })
    }
})

module.exports = app
