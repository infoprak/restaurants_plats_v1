export class FieldsFormat {
    checkName(name:string){
        let minChars = 2
        let maxChars = 25

        let result = ''
        if(name != ''){
            let hasNumber = /\d/;   
            if(!hasNumber.test(name)){
                if(name.length < minChars ) result = `Min. ${minChars}`
                if(name.length > maxChars ) result = `Max. ${maxChars}`
            } else result = "Hi ha números"
        } else result = "Camp buit"
        return result
    }

    checkPhone(phone:string){
        const phonePattern = /^\d{9}$/
        phone = phone.replace(/\s+/g, '');

        let result = ''
        if(!phonePattern.test(phone)) result = 'Número invàlid'
        return result
    }
    
    checkDay(day:any){
        const date = new Date(day);
        let today = new Date()
        console.log(date)
        today.setHours(0, 0, 0, 0);

        let result = ''
        if (!isNaN(date.getTime())) {
            if(date<today) result = "Data no válida"
        } else result = "Data no válida"

        let dd = (date.getDate()).toString()
        let mm = (date.getMonth()+1).toString()
        let yyyy = (date.getFullYear()).toString()
        console.log(dd)
        console.log(mm)
        if(dd.length == 1) dd = `0${dd}`
        if(mm.length == 1) mm = `0${mm}`
        let dayTransformed =  `${dd}/${mm}/${yyyy}`
        console.log(dayTransformed)
        
        return {error:result, day:dayTransformed}
    }
}