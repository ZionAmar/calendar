const express = require('express');
const router = express.Router();
const {
    getCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById
} = require('../middleware/cursesMidd');

// שליפת כל הקורסים
router.get('/', getCourses, (req, res) => {
    res.json(req.courses);
});

// שליפת קורס לפי מזהה
router.get('/:id', getCourseById, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.json(req.course);
});

// יצירת קורס חדש
router.post('/', createCourse, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.status(201).json(req.newCourse);
});

// עדכון קורס קיים
router.put('/:id', updateCourse, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.json(req.updatedCourse);
});

// מחיקת קורס
router.delete('/:id', deleteCourse, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.json(req.deletedMessage);
});

module.exports = router;
