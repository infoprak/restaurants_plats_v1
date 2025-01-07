const conn = require('../mysql');

/***************
 * POSTs
***************/
const addOrderUser = async (order) => {
    const connection = await conn.connection();

    let sql = `insert into orders(name, phone, time, day, price, order_time) values (?,?,?,?,?,?)`;
    try{
        const [rows, fields] = await connection.execute(sql, [order.name, order.phone, order.time, order.day, order.total, order.order_time])
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}
const addOrderPlates = async (sql_values) => {
    const connection = await conn.connection();
    let sql = `insert into order_plates(order_id, plate_id, price, plate_number, description) values (?,?,?,?,?)`;
    try{
        const [rows, fields] = await connection.execute(sql, sql_values);
        return rows;
    }catch(err){
        console.log(err)
        return err;
    } finally {
        connection.release();
    }
}

const addExtras = async (sql_inserts, sql_values) => {
    const connection = await conn.connection();

    let sql = `insert into plate_extras(plate_id, extra_id) values ${sql_inserts}`;
    try{
        const [rows, fields] = await connection.execute(sql, sql_values)
        return rows;
    }catch(err){
        return err;
    } finally {
        connection.release();
    }
}

module.exports = { addExtras, addOrderPlates, addOrderUser }