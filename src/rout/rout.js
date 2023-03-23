const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

//for uploading file
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

//Cloudinary Configuration 
cloudinary.config({
    cloud_name: "dpd6shkim",
    api_key: "534426431882261",
    api_secret: "Y01q04Q4R6Obf9XVa35_o2iuyDk"
});

//collection
const TunerUser = require('../model/Tuner_schema')

//router
const router = new express.Router();

//middlewire
router.use(bodyparser.urlencoded({ extended: true }));
router.use(bodyparser.json())
router.use(cors());
router.use(fileUpload({
    useTempFiles: true
}))

//Registration
router.post("/register", (req, res) => {
    console.log(req.body)
    const dp_files = req.files.photo;
    cloudinary.uploader.upload(dp_files.tempFilePath, async (err, result) => {
        try {
            if (!err) {
                console.log(result.url)
                const password = req.body.password;
                const confirmPassword = req.body.confirmPassword;
                if (password === confirmPassword) {
                    const userData = new TunerUser({
                        imgfile: result.url,
                        name: req.body.name,
                        email: req.body.email,
                        phone: req.body.phone,
                        profession: req.body.profession,
                        password: req.body.password
                    })
                    //hasing password
                    await userData.save()
                    console.log("data sending to db is ==>" + userData);
                    res.status(200).send({
                        status: "sucessfully registered",
                        data: userData
                    })
                } else {
                    res.status(400).send({
                        status: 400,
                        message: "invalid input (pw!==cpw)"
                    })
                }
            }
        } catch (err) {
            res.status(401).send({
                status: 401,
                message: err.message
            })
        }
    })
    // const password = req.body.password;
    // const confirmPassword = req.body.confirmPassword;
    // if (password === confirmPassword) {
    //     const userData = new TunerUser({
    //         name: req.body.name,
    //         email: req.body.email,
    //         phone: req.body.phone,
    //         profession: req.body.profession,
    //         password: req.body.password
    //     })
    //     //hasing password
    //     await userData.save()
    //     console.log("data sending to db is ==>" + userData);
    //     res.status(200).send({
    //         status: "sucessfully registered",
    //         data: userData
    //     })
    // } else {
    //     res.status(400).send({
    //         status: "invalid input"
    //     })
    // }
})


module.exports = router;