
const auth = require("../auth")
const jwt = require("jsonwebtoken")
const SECRET_KEY = "eyosab"
const { isRole } = require("../auth")
const { Op } = require('sequelize');


//import library
const express = require('express');
const bodyParser = require('body-parser');

//implementasi library
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const models = require("../models/index");
const meja = models.meja

//menampilkan semua data meja
app.get("/", isRole(["admin","kasir"]), (req, res) => {
    meja.findAll()
        .then(result => {
            res.json({
                meja: result,
                count : result.length
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })  
})

//menampilkan data meja berdasarkan id
app.get("/:id_meja", isRole(["admin"]), (req, res) =>{
    meja.findOne({ where: {id_meja: req.params.id_meja}})
    .then(result => {
        res.json({
            meja: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

app.post("/", isRole(["admin"]), (req, res) =>{ 
    let data = {
        nomor_meja : req.body.nomor_meja,
        status : req.body.status
    }

    // Validasi status (tersedia/tidak tersedia)
    const validStatus = ["tersedia", "tidak tersedia"];
    if (!validStatus.includes(data.status)) {
        res.json({
            message: "Status tidak sesuai"
        });
    } else {
        // Cek apakah nomor meja sudah ada di database
        meja.findOne({ where: { nomor_meja: data.nomor_meja } })
            .then(existingMeja => {
                if (existingMeja) {
                    // Jika nomor meja sudah ada
                    res.json({
                        message: "Nomor meja sudah ada, tidak bisa ditambahkan"
                    });
                } else {
                    // Jika nomor meja belum ada, maka lakukan insert
                    meja.create(data)
                        .then(result => {
                            res.json({
                                message: "Data meja berhasil ditambahkan"
                            });
                        })
                        .catch(error => {
                            res.json({
                                message: error.message
                            });
                        });
                }
            })
            .catch(error => {
                res.json({
                    message: error.message
                });
            });
    }
});

app.put("/:id", isRole(["admin", "kasir"]), (req, res) => {
    let param = { id_meja: req.params.id };
    let data = {
        nomor_meja: req.body.nomor_meja,
        status: req.body.status,
    };

    // Validasi status
    const validStatus = ["tersedia", "tidak tersedia"];
    if (!validStatus.includes(data.status)) {
        return res.json({
            message: "Status tidak sesuai",
        });
    }

    // Cari meja berdasarkan id untuk mendapatkan nomor meja yang saat ini digunakan
    meja.findOne({ where: { id_meja: req.params.id } })
        .then(currentMeja => {
            if (!currentMeja) {
                return res.json({ message: "Meja tidak ditemukan" });
            }

            // Jika nomor meja tetap sama, izinkan perubahan status
            if (currentMeja.nomor_meja === data.nomor_meja) {
                meja.update({ status: data.status }, { where: param })
                    .then(result => {
                        res.json({
                            message: "Status meja berhasil diperbarui",
                        });
                    })
                    .catch(error => {
                        res.json({
                            message: error.message
                        });
                    });
            } else {
                // Jika nomor meja diubah, cek apakah nomor meja sudah ada di meja lain
                meja.findOne({
                    where: {
                        nomor_meja: data.nomor_meja,
                        id_meja: { [Op.ne]: req.params.id } // Pastikan nomor meja bukan milik meja yang sedang diedit
                    }
                })
                .then(existingMeja => {
                    if (existingMeja) {
                        return res.json({
                            message: "Nomor meja sudah ada, tidak bisa diperbarui"
                        });
                    }

                    // Jika nomor meja tidak ada di meja lain, update meja
                    meja.update(data, { where: param })
                        .then(result => {
                            res.json({
                                message: "Data meja berhasil diperbarui",
                            });
                        })
                        .catch(error => {
                            res.json({
                                message: error.message
                            });
                        });
                })
                .catch(error => {
                    res.json({
                        message: error.message
                    });
                });
            }
        })
        .catch(error => {
            res.json({
                message: error.message
            });
        });
});


//menghapus data meja berdasarkan id
app.delete("/:id", isRole(["admin"]), (req, res) =>{
        let param = { id_meja: req.params.id}
        meja.destroy({where: param})
        .then(result => {
           
            res.json({
                message: "data has been deleted",
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

module.exports = app
