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
async function GetAllCourses(req,res,next){
    let filter = (req.query.filter !== undefined) ? req.query.filter : "";
    let Query="SELECT * FROM courses";
    let wh="";
    if(filter !== ""){
        wh += (wh === "")?" WHERE " : " AND ";
        wh += ` ( name LIKE '%${filter}%' )`;
    }
    // if(req.user_id !== undefined){
    //     wh += (wh === "")?" WHERE " : " AND ";
    //     wh += ` ( id IN (SELECT crs_id FROM crs2user WHERE user_id=${req.user_id}) )`;
    // }
    Query += wh;
    Query += " ORDER BY name ASC ";
    Query+= " LIMIT 0,100 ";

    const promisePool = db_pool.promise();
    let rows=[];
    req.courses_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.courses_data=rows;
    } catch (err) {
        console.log(err);
    }

    next();
}
async function GetCoursesNames(req,res,next){
    let Query="SELECT * FROM courses";

    const promisePool = db_pool.promise();
    let rows=[];
    req.courses_names=[];
    try {
        [rows] = await promisePool.query(Query);
        for(let row of rows) {
            req.courses_names[row.id] = row.name;
        }
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
    GetCoursesNames,
    GetOneCourse,
    DeleteCourse,
    UpdateCourse,
}