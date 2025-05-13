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
router.get('/list', getCourses, (req, res) => {
    res.render("list_crs",{courses: req.courses,title: "רשימת קורסים"});
});

// שליפת קורס לפי מזהה
router.get('crs/:id', getCourseById, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.json(req.course);
});

// יצירת קורס חדש
router.get('/add', (req, res) => {
    res.render("add_crs",{title: "הוספת קורס",
                          data: {}
    });
});
router.post('/add', createCourse, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/curses/list");
});
// עדכון קורס קיים
router.get('/update/:id',getCourseById, (req, res) => {
    res.render("add_crs",{title: "עריכת קורס",
                          data: req.course
    });
});
// עדכון קורס קיים
router.post('/update/:id', updateCourse, getCourses, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/curses/list");
});

// מחיקת קורס
router.post('/delete', deleteCourse, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/curses/list");
});

module.exports = router;
