const express = require('express');
const router = express.Router();
const {
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    getUserById
} = require('../middleware/usersMidd');

// שליפת כל המשתמשים
router.get('/list', getUsers, (req, res) => {
    res.render("list_usr",{users: req.users,title: "רשימת משתמשים"});
});

// שליפת משתמש לפי מזהה
router.get('usr/:id', getUserById, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.json(req.user);
});

// יצירת משתמש חדש
router.get('/add', (req, res) => {
    res.render("add_usr",{title: "הוספת משתמש",
                          data: {}
    });
});
router.post('/add', addUser, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/users/list");
});
// עדכון משתמש קיים
router.get('/update/:id',getUserById, (req, res) => {
    res.render("add_usr",{title: "עריכת משתמש",
                          data: req.user
    });
});
// עדכון משתמש קיים
router.post('/update/:id', updateUser, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/users/list");
});

// מחיקת משתמש
router.post('/delete', deleteUser, (req, res) => {
    if (req.error) return res.status(req.error.status).json({ error: req.error.message });
    res.redirect("/users/list");
});

module.exports = router;
