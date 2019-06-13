const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
var fs = require('fs');
var mongoose = require("mongoose");
const config = require('../config');
const async = require('async');
const sharp = require('sharp');
const Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;


const storageLocal = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/original/');
    },

    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});


const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const uploadLocal = multer({ storage: storageLocal, fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /upload');
})
.post(uploadLocal.array('imageFile', 5),  (req, res) => {
    // console.log(typeof(req.files[0].encoding));
    // for(let i=0;i<req.files.length;i++) {
    //     console.log(req.files[i].originalname);
    // }
    res.statusCode = 200;
    
    
    console.log('calling async...');
    async.forEachOf(req.files, (file) => {
        var path_original = 'public/images/original/'+file.originalname;
        var path_thumb = 'public/images/thumbnails/';
        sharp(path_original)
        .resize({ width: 100, height: 100 })
        .toFile(path_thumb+'100/'+file.originalname, (err) => console.log(err));

        sharp(path_original)
        .resize({ width: 75, height: 75 })
        .toFile(path_thumb+'75/'+file.originalname, (err) => console.log(err));

        sharp(path_original)
        .resize({ width: 125, height: 125 })
        .toFile(path_thumb+'125/'+file.originalname, (err) => console.log(err));
        var gfs = Grid(mongoose.connection.db);
        var writestream = gfs.createWriteStream({filename: path_original});
        fs.createReadStream(path_original).pipe(writestream);
    });

    res.setHeader('Content-Type', 'application/json');
    res.json(req.files);
})
.put( (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /upload');
});
// .delete('/:id', (req, res, next) => {
//     var gfs = Grid(mongoose.connection.db);

//     gfs.remove({_id: req.params.id }, (err, gridStore) => {
//         if (err) return handleError(err);
//         console.log('success');
//       });
// });

module.exports = uploadRouter;