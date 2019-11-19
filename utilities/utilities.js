function has_null(...values){
    for (let i=0; i < values.length; i++){
        if(values[i] === null){
            return true;
        }
    }
    return false;
}
function get_value(from, key){
    if(from[key] === null || from[key] === undefined){
        return null;
    }
    return from[key];
}
function to_non_negative(number){
    let t = parseInt(number);
    if(isNaN(t)){
        return null;
    }
    if(t.toString() == number && t >= 0){
        return t;
    }else{
        return null;
    }
}
module.exports.has_null = has_null;
module.exports.get_value = get_value;
module.exports.to_non_negative = to_non_negative;