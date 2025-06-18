async function AddNewActivity(req,res,next){
    let user_id = req.user_id;
    let study_date=(req.body.study_date !== undefined)?addSlashes(req.body.study_date):"";
    let course_id =(req.body.course_id !== undefined )?Number(req.body.course_id ):"";
    let start_time =(req.body.start_time !== undefined )?addSlashes(req.body.start_time ):"";
    let end_time =(req.body.end_time !== undefined )?addSlashes(req.body.end_time ):"";
    let notes =(req.body.notes !== undefined )?addSlashes(req.body.notes ):"";
    let is_plan = 1;

    let Query = "INSERT INTO `study_data`";
    Query += "( `user_id`, `study_date`, `course_id`, `start_time`, `end_time`, `is_plan`, `notes`)  ";
    Query += " VALUES ";
    Query += `( '${user_id}', '${study_date}', '${course_id}', '${start_time}', '${end_time}', '${is_plan}', '${notes}')  `;

    req.ok=false;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
        req.ok=true;
    } catch (err) {
        console.log(err);
    }
    next();
}

async function GetAllActivities(req,res,next){
    let Query="SELECT *,DATE_FORMAT(study_date,'%d-%m-%Y') AS nice_date FROM study_data";
    Query += " ORDER BY study_date DESC, start_time DESC ";

    const promisePool = db_pool.promise();
    let rows=[];
    req.activity_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.activity_data=rows;
    } catch (err) {
        console.log(err);
    }

    next();
}
module.exports = {
    AddNewActivity,
    GetAllActivities,
}