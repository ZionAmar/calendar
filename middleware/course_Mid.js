async function AddCourse(req,res,next){
    let name = addSlashes(req.body.name);// a' or (drop table courses --
    let Query=`INSERT INTO courses( name) VALUES ('${name}')`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function UpdateCourse(req,res,next){
    let id = parseInt(req.params.id);
    if(id <= 0){
        req.GoodOne=false;
        return next();
    }
    req.GoodOne=true;
    let name = addSlashes(req.body.name);// a' or (drop table courses --
    let Query=`UPDATE courses SET name='${name}' WHERE id='${id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function GetAllCourses(req, res, next) {
    let page = 0;
    let rowPerPage = 2; // או כל כמות אחרת שתרצה בעמוד
    if (req.query.p !== undefined) {
        page = parseInt(req.query.p);
    }
    req.page = page;

    let rows = [];
    const promisePool = db_pool.promise();
    let total_rows = 0;

    // שלב 1: ספירת הקורסים
    let Query = "SELECT COUNT(id) AS cnt FROM courses";
    try {
        [rows] = await promisePool.query(Query);
        total_rows = rows[0].cnt;
    } catch (err) {
        console.log(err);
    }
    req.total_pages = Math.floor(total_rows / rowPerPage);

    // שלב 2: שליפת הקורסים לעמוד הנוכחי
    Query = "SELECT * FROM courses";
    Query += ` LIMIT ${page * rowPerPage}, ${rowPerPage}`;
    req.courses_data = [];
    try {
        [rows] = await promisePool.query(Query);
        req.courses_data = rows;
    } catch (err) {
        console.log(err);
    }

    next();
}

async function GetOneCourse(req,res,next){
    let id = parseInt(req.params.id);
    console.log(id)
    if((id === NaN) || (id <= 0)){
        req.GoodOne=false;
        return next();
    }
    req.GoodOne=true;
    let Query=`SELECT * FROM courses  WHERE id='${id}' `;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_course_data=[];
    try {
        [rows] = await promisePool.query(Query);
        if(rows.length > 0) {
            req.one_course_data = rows[0];
        }
    } catch (err) {
        console.log(err);
    }

    next();
}
async function DeleteCourse(req,res,next){
    let id = parseInt(req.body.id);
    if(id > 0) {
        let Query = `DELETE FROM courses WHERE id='${id}' `;
        const promisePool = db_pool.promise();
        let rows = [];
        try {
            [rows] = await promisePool.query(Query);
        } catch (err) {
            console.log(err);
        }
    }

    next();

}
module.exports = {
    AddCourse,
    GetAllCourses,
    GetOneCourse,
    DeleteCourse,
    UpdateCourse,
}