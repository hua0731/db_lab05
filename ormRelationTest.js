// ormRelationTest.js
const { Student, Course, Department } = require('./models');

async function testRelations() {
  try {
    // 查詢學生及其所屬系所
    const student = await Student.findByPk('S10810001', {
      include: [Department]
    });

    if (!student) {
      console.log('找不到該學生 S10810001');
      return;
    }

    // 修正名稱為 student.Department.Name
    console.log(`學生 ${student.Name} 屬於 ${student.Department.Name} 系`);

    // 查詢學生及其選修的所有課程
    const studentWithCourses = await Student.findByPk('S10810001', {
      include: [Course]
    });

    console.log(`${studentWithCourses.Name} 選修的課程：`);
    studentWithCourses.Courses.forEach(course => {
      console.log(`- ${course.Title} (${course.Credits} 學分)`);
    });

    // 查詢課程及其選修的學生
    const courseWithStudents = await Course.findByPk('CS303001', {
      include: [Student]
    });

    // 判斷是否找到課程
    if (courseWithStudents) {
      console.log(`選修 ${courseWithStudents.Title} 的學生：`);
      courseWithStudents.Students.forEach(student => {
        console.log(`- ${student.Name} (${student.Student_ID})`);
      });
    } else {
      console.log('找不到課程 CS303001');
    }

  } catch (err) {
    console.error('關聯查詢出錯：', err);
  }
}

testRelations();
