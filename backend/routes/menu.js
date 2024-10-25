//import library
const express = require('express');
const bodyParser = require('body-parser');

const { isRole } = require("../auth")
const SECRET_KEY = "eyosab"

//import multer
const multer = require("multer")
const path = require("path")
const fs = require("fs")

//implementasi library
const app = express();
const { Op } = require("sequelize")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//import model
const model = require('../models/index');
const menu = model.menu

//config storage gambar
const storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,"./gambar/menu")
    },
    filename: (req,file,cb) => {
        cb(null, "img-" + Date.now() + path.extname(file.originalname))
    }
})
let upload = multer({storage: storage})

// Menyajikan folder gambar sebagai file statis
app.use('/gambar/menu', express.static(path.join(__dirname, '../gambar/menu')));

//endpoint menampilkan semua data menu, method: GET, function: findAll()
app.get("/", isRole(["admin","kasir"]), async (req,res) => {
    menu.findAll()
        .then(result => {
            res.json({
                menu : result,
                count : result.length
            })
        })
        .catch(error => {
            res.json({
                message: error.message
            })
        })
})

//menampilkan data menu berdasarkan id
app.get("/:id_menu", isRole(["admin"]), async (req, res) =>{
    menu.findOne({ where: {id_menu: req.params.id_menu}})
    .then(result => {
        res.json({
            menu: result
        })
    })
    .catch(error => {
        res.json({
            message: error.message
        })
    })
})

//endpoint untuk menyimpan data menu, METHOD: POST, function: create
app.post("/", upload.single("gambar"), isRole(["admin"]), async (req, res) => {
    if (!req.file) {
        res.json({
            message: "No uploaded file"
        })
    } else {
        let data = {
            nama_menu: req.body.nama_menu,
            jenis: req.body.jenis,
            deskripsi: req.body.deskripsi,
            gambar: req.file.filename,
            harga: req.body.harga
        }

        // Validasi harga tidak boleh minus
        if (data.harga < 0) {
            return res.json({
                message: "Harga tidak bisa minus"
            })
        }

        // Validasi jenis hanya bisa "makanan" atau "minuman"
        if (data.jenis !== "makanan" && data.jenis !== "minuman") {
            return res.json({
                message: "Jenis hanya bisa 'makanan' atau 'minuman'"
            })
        }

        menu.create(data)
            .then(result => {
                res.json({
                    message: "Data has been inserted"
                })
            })
            .catch(error => {
                res.json({
                    message: error.message
                })
            })
    }
})

app.put("/:id", upload.single("gambar"), isRole(["admin"]), async (req, res) => {
    let param = {
        id_menu: req.params.id
    };

    let data = {
        nama_menu: req.body.nama_menu,
        jenis: req.body.jenis,
        deskripsi: req.body.deskripsi,
        harga: req.body.harga
    };

    // Validasi harga tidak boleh minus
    if (data.harga < 0) {
        return res.status(400).json({ message: "Harga tidak bisa minus" });
    }

    // Validasi jenis hanya bisa "makanan" atau "minuman"
    if (data.jenis !== "makanan" && data.jenis !== "minuman") {
        return res.status(400).json({ message: "Jenis hanya bisa 'makanan' atau 'minuman'" });
    }

    try {
        // Cek apakah ada file gambar baru
        if (req.file) {
            // Ambil data menu berdasarkan ID
            const row = await menu.findOne({ where: param });

            // Cek apakah menu ditemukan
            if (!row) {
                return res.status(404).json({ message: "Menu item not found" });
            }

            let oldFileName = row.gambar;

            // Hapus file lama
            let dir = path.join(__dirname, "../gambar/menu", oldFileName);
            await fs.promises.unlink(dir); // Menggunakan promisify untuk unlink
            console.log(`Successfully deleted ${oldFileName}`);

            // Set nama file baru
            data.gambar = req.file.filename;
        }

        // Update menu
        const [updated] = await menu.update(data, { where: param });

        // Cek apakah ada data yang diperbarui
        if (updated) {
            const updatedMenu = await menu.findOne({ where: param }); // Ambil data yang diperbarui
            return res.status(200).json({
                message: "Data has been updated",
                data: updatedMenu
            });
        }

        res.status(404).json({ message: "Menu item not found or not updated" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


//menghapus data menu berdasarkan id
app.delete("/:id", isRole(["admin"]), async (req, res) =>{
    try {
        let param = { id_menu: req.params.id}
        let result = await menu.findOne({where: param})
        let oldFileName = result.gambar
           
        // delete old file
        let dir = path.join(__dirname,"../gambar/menu",oldFileName)
        fs.unlink(dir, err => console.log(err))

        // delete data
        menu.destroy({where: param})
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

    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

//search menu
app.get("/search/:keyword", async (req, res) => {
    let keyword = req.params.keyword //keyword?
    let result = await menu.findAll({
        where: {
            [Op.or]: [
                {
                    id_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    nama_menu: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    jenis: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    deskripsi: {
                        [Op.like]: `%${keyword}%`
                    }
                },
                {
                    harga: {
                        [Op.like]: `%${keyword}%`
                    }
                },
            ]
        }
    })
    res.json({
        menu: result
    })
})

module.exports = app
