const extraDatabase = require("../../database/extra_database/extraDatabase");

/***************
 * GETs
***************/
const getAll = async (lang) => {
    return await extraDatabase.getAll(lang)
}

const getPrice = async (id) => {
    return await extraDatabase.getPrice(id)
}

module.exports = {getAll, getPrice}