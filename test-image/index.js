require('dotenv/config');
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app =express();
const port = 3000;

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

const storage = multer.memoryStorage({
    destination: function (req, file, callback) {
        callback(null, '')
    }
})

const upload = multer({storage}).single('image')

app.post('/upload', upload, (req, res) => {


    let myFile = req.file.originalname

    // console.log(req.file);

    res.send({
        message: "Uploaded to AWS"
    });

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: myFile,
        Body: req.file.buffer
    }

    s3.upload(params, (error, data) => {
        if(error) {
            res.status(500).send(error)
        }

        res.status(200).send(data)
    })
})

app.listen(port, () => {
    console.log('Server is up at ' + port);
})
