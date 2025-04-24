// crudExample.js
const pool = require('./db');

async function basicCrud() {
    let conn;
    try {
        conn = await pool.getConnection();

        // 1. INSERT 新增
        let sql = 'INSERT  IGNORE INTO STUDENT (Student_ID, Name, Birth_Date, Gender, Email, Phone, Address, Admission_Year, Status, Department_ID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const result1 = await conn.query(sql, ['S10810001', '王曉明', '2001-07-31', 'M', 'wang@example.com', '0989-987-978', '台北市信義區信義路五段9號', '2019', '在學', 'CS001']);
        console.log (result1.affectedRows > 0 ? '已新增學生資料' : '該學號已存在'); 
            
        // 2. SELECT 查詢
        sql = 'SELECT * FROM STUDENT WHERE Department_ID = ?';
        const rows = await conn.query(sql, ['CS001']);
        console.log('查詢結果：', rows);

        // 3. UPDATE 更新
        sql = 'UPDATE STUDENT SET Name = ? WHERE Student_ID = ?';
        const result2 = await conn.query(sql, ['王小明', 'S10810001']);
        if (result2.affectedRows === 0) {
            console.error('學生學號不存在');
        } else {
            console.log('已更新學生名稱');
        }

        // 4. DELETE 刪除
        sql = 'DELETE FROM STUDENT WHERE Student_ID = ?';
        const result3 = await conn.query(sql, ['S10810001']);
        if (result3.affectedRows === 0) {
            console.error('學生學號不存在');
        } else {
             console.log('已刪除該學生');
        }
       

    } catch (err) {
        console.error('操作失敗：', err);
    } finally {
        if (conn) conn.release();
    }
}

basicCrud();
