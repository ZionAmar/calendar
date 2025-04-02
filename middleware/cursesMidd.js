const db = require('../database'); // ייבוא חיבור למסד הנתונים

// Middleware לשליפת כל הקורסים
async function getCourses(req, res, next) {
    try {
        const [rows] = await db.query('SELECT * FROM courses');
        req.courses = rows;
        next();
    } catch (err) {
        req.error = { status: 500, message: 'Error fetching courses' };
        next(err);
    }
}

// Middleware ליצירת קורס חדש
async function createCourse(req, res, next) {
    const { name } = req.body;

    if (!name) {
        req.error = { status: 400, message: 'Missing required fields' };
        return next();
    }

    try {
        const [result] = await db.query(
            'INSERT INTO courses (name) VALUES (?)',
            [name]
        );

        req.newCourse = { id: result.insertId, name };
        next();
    } catch (err) {
        req.error = { status: 500, message: 'Error creating course' };
        next(err);
    }
}

// Middleware לעדכון קורס קיים
async function updateCourse(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
        req.error = { status: 400, message: 'Missing course id or name' };
        return next();
    }

    try {
        const [result] = await db.query(
            'UPDATE courses SET name = ? WHERE id = ?',
            [name, id]
        );

        if (result.affectedRows === 0) {
            req.error = { status: 404, message: 'Course not found' };
            return next();
        }

        req.updatedCourse = { id, name };
        next();
    } catch (err) {
        req.error = { status: 500, message: 'Error updating course' };
        next(err);
    }
}

// Middleware למחיקת קורס
async function deleteCourse(req, res, next) {
    const { id } = req.params;

    if (!id) {
        req.error = { status: 400, message: 'Missing course id' };
        return next();
    }

    try {
        const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            req.error = { status: 404, message: 'Course not found' };
            return next();
        }

        req.deletedMessage = { message: 'Course deleted successfully' };
        next();
    } catch (err) {
        req.error = { status: 500, message: 'Error deleting course' };
        next(err);
    }
}

// Middleware לשליפת קורס לפי מזהה
async function getCourseById(req, res, next) {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
        if (rows.length === 0) {
            req.error = { status: 404, message: 'Course not found' };
            return next();
        }
        req.course = rows[0];
        next();
    } catch (err) {
        req.error = { status: 500, message: 'Error fetching course' };
        next(err);
    }
}

module.exports = {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById
};
