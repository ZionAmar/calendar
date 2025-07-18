var md5 = require('md5');

async function isLogged(req, res,next){
    const jwtToken = req.cookies.ImLoggedToYoman;
    let user_id=-1;
    if (jwtToken !== "") {
        jwt.verify(jwtToken, 'myPrivateKey', async (err, decodedToken) => {
            if (err) {
                console.log("err=",err);
            } else {
                let data = decodedToken.data;
                user_id = data.split(",")[0];
                req.user_id=user_id;
            }
        })
    }
    if(user_id < 0)
        res.redirect("/login");

    next();
}
async function CheckLogin(req, res,next) {
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    let passwd  = (req.body.passwd !== undefined) ?            req.body.passwd      : "";
    let enc_pass = md5("A"+passwd);
    let Query = `SELECT * FROM users WHERE uname = '${uname}' AND passwd = '${enc_pass}'`;

    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    if(rows.length > 0){
        req.validUser = true;
        let val = `${rows[0].id},${rows[0].name}`;
        var token = jwt.sign(
            {data: val},
            'myPrivateKey',
            { expiresIn: 31*24*60*60 // in sec
            });
        res.cookie("ImLoggedToYoman", token, {
            maxAge: 31*24*60*60 * 1000, // 3hrs in ms
        });

    }

    next();
}
async function AddUser(req,res,next){
    let name    = (req.body.name   !== undefined) ? addSlashes(req.body.name      ) : "";
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    let passwd  = (req.body.passwd !== undefined) ?            req.body.passwd      : "";
    let enc_pass = md5("A"+passwd);
    let email   = (req.body.email  !== undefined) ? addSlashes(req.body.email     ) : "";
    let type_id = (req.body.type_id!== undefined) ?     Number(req.body.type_id   ) : -1;
    let tz      = (req.body.tz     !== undefined) ? addSlashes(req.body.tz        ) : "";

    let Query="INSERT INTO users";
    Query +="( `name`, `uname`, `passwd`, `email`, `type_id`, `tz`)";
    Query +=" VALUES ";
    Query +=`( '${name}', '${uname}', '${enc_pass}', '${email}', '${type_id}', '${tz}')`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function UpdateUser(req,res,next){
    let id = parseInt(req.params.id);
    let name    = (req.body.name   !== undefined) ? addSlashes(req.body.name      ) : "";
    let uname   = (req.body.uname  !== undefined) ? addSlashes(req.body.uname     ) : "";
    let email   = (req.body.email  !== undefined) ? addSlashes(req.body.email     ) : "";
    let type_id = (req.body.type_id!== undefined) ?     Number(req.body.type_id   ) : -1;
    let tz      = (req.body.tz     !== undefined) ? addSlashes(req.body.tz        ) : "";
    if(id <= 0){
        req.GoodOne=false;
        return next();
    }
    req.GoodOne=true;

    let Query=`UPDATE users SET `;
    Query +=`name   ='${name   }' ,`;
    Query +=`uname  ='${uname  }' ,`;
    Query +=`email  ='${email  }' ,`;
    Query +=`type_id='${type_id}' ,`;
    Query +=`tz     ='${tz     }'  `;
    Query +=` WHERE id='${id}'`;
    const promisePool = db_pool.promise();
    let rows=[];
    try {
        [rows] = await promisePool.query(Query);
    } catch (err) {
        console.log(err);
    }

    next();
}
async function GetAllUsers(req,res,next){
    let page=0;
    let rowPerPage=2;
    if(req.query.p !== undefined){
        page=parseInt(req.query.p);
    }
    req.page = page;

    let rows=[];
    //--- count pages---
    let Query = "SELECT COUNT(id) AS cnt FROM users";
    const promisePool = db_pool.promise();
    let total_rows=0;
    try {
        [rows] = await promisePool.query(Query);
        total_rows=rows[0].cnt;
    } catch (err) {
        console.log(err);
    }
    req.total_pages = Math.floor(total_rows/rowPerPage);
    //--- get current page ---
    Query="SELECT * FROM users";
    Query += ` LIMIT ${page*rowPerPage},${rowPerPage} `;
    req.users_data=[];
    try {
        [rows] = await promisePool.query(Query);
        req.users_data=rows;
    } catch (err) {
        console.log(err);
    }

    next();
}
async function GetOneUser(req,res,next){
    let id = parseInt(req.params.id);
    console.log(id)
    if((id === NaN) || (id <= 0)){
        req.GoodOne=false;
        return next();
    }
    req.GoodOne=true;
    let Query=`SELECT * FROM users  WHERE id='${id}' `;
    const promisePool = db_pool.promise();
    let rows=[];
    req.one_user_data=[];
    try {
        [rows] = await promisePool.query(Query);
        if(rows.length > 0) {
            req.one_user_data = rows[0];
        }
    } catch (err) {
        console.log(err);
    }

    next();
}
async function DeleteUser(req,res,next){
    let id = parseInt(req.body.id);
    if(id > 0) {
        let Query = `DELETE FROM users WHERE id='${id}' `;
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
    AddUser,
    GetAllUsers,
    GetOneUser,
    DeleteUser,
    UpdateUser,
    CheckLogin,
    isLogged,
}