const { Student, Course, Enrollment } = require('./models');
const { syncPromise } = require('./orm');

async function findUngraded() {
  try {
    const ungradedRecords = await Enrollment.findAll({
      where: { Grade: null },
      include: [
        {
          model: Student,
          attributes: ['Student_ID', 'Name']
        },
        {
          model: Course,
          attributes: ['Course_ID', 'Title']
        }
      ]
    });

    console.log('未評分的選課記錄：');
    ungradedRecords.forEach(record => {
      const student = record.Student;
      const course = record.Course;
      console.log(`學生：${student.Name} (${student.Student_ID}), 課程：${course.Title} (${course.Course_ID})`);
    });

    return ungradedRecords;
  } catch (err) {
    console.error('查詢失敗：', err);
  }
}

syncPromise.then(() => {
  findUngraded();
});