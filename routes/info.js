const express = require('express')
const router = express.Router()
const studentController = require('../controller/studentInfo')
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/')
            .get(studentController.getupload)
// router.route('/student/:id')
//             .get(studentController.getstudent)
router.route('/upload')
            .post(upload.single('file'),studentController.addstudent)


module.exports = router