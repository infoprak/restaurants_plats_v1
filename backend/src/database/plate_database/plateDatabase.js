const conn = require('../mysql');

/***************
 * GETs
***************/
const getAll = async (lang) => {
    const connection = await conn.connection();
    let sql = `select 
    p.id, p.time_minutes, p.preu, p.image, p.state, p.special, p.clasification,
    lp.name, lp.description
    from plate p
    JOIN plate_lang lp on lp.plate_id = p.id
    where lp.lang_id = ?
    order by p.clasification`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang])
        return rows;
    }catch(err){
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

const getOne = async (plate) => {
    const connection = await conn.connection();
    let sql = `select plate_id from plate_lang where name = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [plate])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getPrice = async (id) => {
    const connection = await conn.connection();
    let sql = `select preu from plate where id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [id])
        return rows[0].preu;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getLabels = async (lang) => {
    const connection = await conn.connection();
    let sql = `select 
    pl.plate_id, l.icon,ll.name as name
    from plate_labels pl
    JOIN labels l on pl.label_id = l.id
    JOIN lang_label ll on  l.id = ll.label_id
    JOIN plate p on pl.plate_id = p.id
	where ll.lang_id = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

const getPlatesClasification = async (lang) => {
    const connection = await conn.connection();
    let sql = `select name, id_clasification as id from lang_clasification where id_lang = ?`;
    try{
        const [rows, fields] = await connection.execute(sql, [lang])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { getAll, getLabels, getOne, getPlatesClasification, getPrice }