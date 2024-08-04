const Students = require('../model/student')
const path = require('path')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const xlsx = require('xlsx')


const Totalhours = (Students)=>{
    let totalhours = 0
    Students.courses.forEach((course)=>{
      totalhours += course.hours * 1
    })
    return totalhours
}

const TotalHoursSuccess = (Students) =>{
    let total = 0 
    Students.courses.forEach((course)=>{
      if(course.grade != 'F' && course.points !='0.00')
      {
        total += course.hours * 1
      }
    })
    return total
} 

const TotalDegrees =  (Students) =>{
  let total = 0 
  Students.courses.forEach((course)=>{
    if(course.grade != 'F' && course.points !='0.00' && course.courseCode != '21019' && course.courseCode != 'CA1201')
    {
      total += course.score * 1
    }
  })
  return total
}
const Totalpoints = (Students)=>{
    let total = 0
      Students.courses.forEach((course)=>{
        if(course.grade != 'F' && course.points !='0.00')
        {
          total += (course.points * course.hours) * 1
        }
    })
    return total
}

const TotalGpa = (Students , totalpoints , totalhours)=>{
    let total = 0
    Students.courses.forEach((course)=>{
      total = (totalpoints / totalhours) * 1
    })
    return total
}

const Percentage = (totalGpa)=>{
    return p = totalGpa * 10 +50
}


const Grade = (percentage) => {
  if(percentage < 60)
  {
    return  "F"
  }
  else if(percentage >= 60 && percentage < 65)
  {
    return  "D"
  }
  else if(percentage >= 65 && percentage < 75)
  {
    return  "C"
  }
  else if(percentage >= 75 && percentage < 85)
  {
     return  "B"
  }
  else if(percentage >= 85 && percentage <= 100)
  {
     return "A"
  }
}

const DiscountHours = (Students)=>{
    let sum = 0;
    Students.courses.forEach((course) => {
        let counter = 0;
        if (course.grade == "F") {
            Students.courses.forEach((c) => {
                if (c.courseCode == course.courseCode) {
                    counter++;
                }
            });
            let dhour = (counter-2) * course.hours
            sum += dhour
        }
    });
    return sum
}

// const getstudent = async(req,res)=>{
//     const student = await Students.findOne({ 'studentInfo.idNumber' : req.params.id})
//     let totalhours = Totalhours(student)
//     let totalHoursSuccess = TotalHoursSuccess(student)
//     let totalpoints = Totalpoints(student).toFixed(2)
//     let totalGpa = TotalGpa(student , totalpoints , totalhours).toFixed(2)
//     let percentage = Percentage(totalGpa).toFixed(1) + "%"
//     let grade = Grade(percentage)
//     let discountHours = DiscountHours(student)
//     res.render('index', {
//       student,
//       totalhours,
//       totalHoursSuccess,
//       totalpoints,
//       totalGpa,
//       percentage,
//       grade,
//       discountHours
//   });
// }

const processExcel = (buffer) => {
  const workbook = xlsx.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const rawData = xlsx.utils.sheet_to_json(sheet, { defval: "" });

  const cleanData = {
    studentInfo: {
      name: "",
      studentNumber: "",
      idNumber: "",
      nationality: "",
      birthPlace: "",
      birthDate: "",
      enrollmentStatus: "",
      studyLevel: "",
      admissionYear: ""
    },
    previousQualification: {
      qualificationYear: "",
      qualificationType: "",
      totalScore: ""
    },
    courses: []
  };

  rawData.forEach(row => {
    if (row['__EMPTY_55']) {
      cleanData.studentInfo.name = row['__EMPTY_55'];
    }
    if (row['__EMPTY_21']) {
      cleanData.studentInfo.studentNumber = row['__EMPTY_21'];
    }
    if (row['__EMPTY_56']) {
      cleanData.studentInfo.idNumber = row['__EMPTY_56'];
    }
    if (row['__EMPTY_58']) {
      cleanData.studentInfo.nationality = row['__EMPTY_58'];
    }
    if (row['__EMPTY_19']) {
      cleanData.studentInfo.birthPlace = row['__EMPTY_19'];
    }
    if (row['__EMPTY_59']) {
      cleanData.studentInfo.birthDate = row['__EMPTY_59'];
    }
    if (row['__EMPTY_57']) {
      cleanData.studentInfo.enrollmentStatus = row['__EMPTY_57'];
    }
    if (row['__EMPTY_11']) {
      cleanData.studentInfo.studyLevel = row['__EMPTY_11'];
    }
    if (row['__EMPTY_58']) {
      cleanData.studentInfo.admissionYear = row['__EMPTY_58'];
    }

    if (row['__EMPTY_28']) {
      cleanData.previousQualification.qualificationYear = row['__EMPTY_28'];
    }
    if (row['__EMPTY_57']) {
      cleanData.previousQualification.qualificationType = row['__EMPTY_57'];
    }
    if (row['__EMPTY_60']) {
      cleanData.previousQualification.totalScore = row['__EMPTY_60'];
    }

    const course = {
      grade: row['__EMPTY_9'],
      points: row['__EMPTY_15'],
      score: row['__EMPTY_17'],
      hours: row['__EMPTY_27'],
      courseName: row['__EMPTY_33'],
      courseCode: row['__EMPTY_51']
    };

    if(course.courseCode !== "" && course.courseName !== "" && course.courseName !== "اسم المقرر") {
      cleanData.courses.push(course);
    }
  });

  return cleanData;
};


const addstudent = async(req,res)=>{
  try {
    const fileBuffer = req.file.buffer;
    const studentData = processExcel(fileBuffer);
    let totalhours = Totalhours(studentData);
    let totalHoursSuccess = TotalHoursSuccess(studentData);
    let totalpoints = Totalpoints(studentData).toFixed(2);
    let totalGpa = TotalGpa(studentData, totalpoints, totalhours).toFixed(2);
    let percentage = Percentage(totalGpa).toFixed(2) + "%";
    let percentageINT = parseFloat(percentage)
    let grade = Grade(percentageINT);
    let discountHours = DiscountHours(studentData);
    let totaldegrees = TotalDegrees(studentData);
     
    res.render('index', {
      student: studentData,
      totalhours,
      totalHoursSuccess,
      totalpoints,
      totalGpa,
      percentage,
      grade,
      discountHours,
      totaldegrees,
    });
  } catch (error) {
    res.status(500).send("An error occurred while processing the file.");
  }
};


const getupload = async(req,res)=>{
  res.sendFile(path.join(__dirname , '../' , 'views' , 'upload.html'))
}


module.exports = {
    // getstudent,
    addstudent,
    getupload
}