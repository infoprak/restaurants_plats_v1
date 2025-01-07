const conn = require('../mysql');

/***************
 * POSTs
***************/
const getAll = async (lang) => {
    const connection = await conn.connection();

    let sql = `select e.id, le.name, e.price from extras e 
    join lang_extras le on le.extra_id = e.id where le.lang_id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang])
        return rows;

    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getPrice = async (id) => {
    const connection = await conn.connection();

    let sql = `select price from extras where id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [id])
        return rows[0].price;

    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

module.exports = {getAll,getPrice}