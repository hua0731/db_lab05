const { Student, Course, Enrollment, sequelize } = require('./models');

async function transferStudent(studentId, oldDeptId, newDeptId) {
  const transaction = await sequelize.transaction();
  const currentSemester = '112-2'; // 假設固定學期

  try {
    // 1. 確認學生存在
    const student = await Student.findByPk(studentId, { transaction });
    if (!student) {
      console.error(`錯誤：學號 ${studentId} 不存在`);
      await transaction.rollback();
      return;
    }

    // 2. 更新學生系所
    student.Department_ID = newDeptId;
    await student.save({ transaction });

    // 3. 更新舊系所必修課為「轉系退選」
    const oldRequiredCourses = await Course.findAll({
      where: {
        Department_ID: oldDeptId,
        Is_Required: true
      },
      attributes: ['Course_ID'],
      transaction
    });

    const oldCourseIds = oldRequiredCourses.map(c => c.Course_ID);

    await Enrollment.update(
      { Status: '轉系退選' },
      {
        where: {
          Student_ID: studentId,
          Course_ID: oldCourseIds
        },
        transaction
      }
    );

    // 4. 取得新系所必修課
    const newRequiredCourses = await Course.findAll({
      where: {
        Department_ID: newDeptId,
        Is_Required: true
      },
      attributes: ['Course_ID'],
      transaction
    });

    // 5. 為新必修課新增 ENROLLMENT 紀錄
    const enrollmentData = newRequiredCourses.map(course => ({
      Student_ID: studentId,
      Course_ID: course.Course_ID,
      Semester: currentSemester,
      Status: '轉系加選'
    }));

    await Enrollment.bulkCreate(enrollmentData, { transaction });

    await transaction.commit();
    console.log(`學生 ${studentId} 已從 ${oldDeptId} 轉到 ${newDeptId}`);
  } catch (err) {
    await transaction.rollback();
    console.error('轉系處理失敗：', err);
  }
}

// 範例執行
transferStudent('S10811005', 'CS001', 'EE001');
