const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
    studentInfo: {
        name :  {type : String},
        studentNumber : {type : String},
        idNumber: {type : String},
        nationality: {type : String},
        birthPlace: {type : String},
        birthDate: {type : String},
        enrollmentStatus: {type : String},
        studyLevel: {type : String},
        admissionYear: {type : String}
      },
      previousQualification: {
        qualificationYear: {type : Number},
        qualificationType: {type : String},
        totalScore: {type : Number}
      },
      courses: [{
        grade: {type : String},
        points: {type : String},
        score: {type : String},
        hours: {type : String},
        courseName: {type : String},
        courseCode: {type : String}
      }]
})

module.exports = mongoose.model('Students' , StudentSchema)