const express = require('express');
const router = express.Router();
module.exports = router;

const course_Mid = require("../middleware/course_Mid");

router.get("/Add",(req,res)=>{
    res.render("crs_add",{
        data:{},
    });
});
router.post("/Add", [course_Mid.AddCourse], (req, res) => {
    res.redirect("./List");
});
router.get("/Edit/:id",[course_Mid.GetOneCourse],(req,res)=>{
    if(req.GoodOne) {
        res.render("crs_add", {
            data: req.one_course_data,
        });
    } else{
        res.redirect("/Crs/List");
    }
});
router.post("/Edit/:id", [course_Mid.UpdateCourse], (req, res) => {
    res.redirect("../List");
});
router.get("/List", [course_Mid.GetAllCourses], (req, res) => {
    res.render("crs_list", {
        page_title: "רשימת הקורסים",
        courses: req.courses_data,
        page: req.page,
        total_pages: req.total_pages,
    });
});
router.post("/Delete",[course_Mid.DeleteCourse],(req,res)=>{
    res.redirect("./List");
})