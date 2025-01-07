const plateDatabase = require("../../database/plate_database/plateDatabase");

/***************
 * GETs
***************/
const getAll = async (lang) => {
    let plates = await plateDatabase.getAll(lang);
    let labels = await plateDatabase.getLabels(lang);
    let clasification = 0;
    plates.forEach(p => {
        if(p.clasification > clasification){
            p.index = p.clasification;
            clasification = p.clasification
        } else {p.index = null}
        let labels_tmp = labels.filter(l => l.plate_id == p.id)
        p.labels = []
        labels_tmp.forEach(l => {
            p.labels.push({label:l.name, icon:l.icon})
        })
    });
    return plates
}

const getPrice = async (id) => {
    return await plateDatabase.getPrice(id)
}

const getPlatesClasification = async (lang) => {
    return await plateDatabase.getPlatesClasification(lang);
}

module.exports = {getAll, getPlatesClasification, getPrice}