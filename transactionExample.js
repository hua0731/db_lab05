// transactionExample.js
const pool = require('./db');

async function doTransaction() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const studentId = 'S10810001';
    const newDeptId = 'EE001';

    // 確認學生是否存在
    const checkRows = await conn.query(
      'SELECT Student_ID FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );

    if (!checkRows || checkRows.length === 0) {
      console.log(`學號 ${studentId} 不存在`);
      await conn.rollback();
      return;
    }

    // 更新資料
    await conn.query(
      'UPDATE STUDENT SET Department_ID = ? WHERE Student_ID = ?',
      [newDeptId, studentId]
    );

    // 提交交易
    await conn.commit();
    console.log('交易成功，已提交');

    // 查詢更新後的資料
    const updatedRows = await conn.query(
      'SELECT * FROM STUDENT WHERE Student_ID = ?',
      [studentId]
    );

    console.log('查詢結果：', updatedRows);

    // 印出學生目前的系別
    console.log(`學生 ${studentId} 目前的系別為：${updatedRows[0].Department_ID}`);

  } catch (err) {
    if (conn) await conn.rollback();
    console.error('交易失敗，已回滾：', err.message);
  } finally {
    if (conn) conn.release();
  }
}

doTransaction();
