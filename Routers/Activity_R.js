const express = require('express');
const router = express.Router();
module.exports = router;

const Activity_Mid = require("../middleware/Activity_Mid");
const course_Mid = require("../middleware/course_Mid");

router.get('/plan', [course_Mid.GetAllCourses], (req, res) => {
    res.render("activity_add",{
        courses : req.courses_data,
        data:{},
    });
});
router.post('/plan', [Activity_Mid.AddNewActivity], (req, res) => {
    res.redirect("./plan");
});
router.get("/List",[Activity_Mid.GetAllActivities,course_Mid.GetCoursesNames],(req,res)=>{
    res.render("activity_List",{
        courses_names : req.courses_names,
        activity_data:req.activity_data,
    });
});