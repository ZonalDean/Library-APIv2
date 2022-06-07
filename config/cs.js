exports.AVAILABLE = 'AVAILABLE'
exports.RESERVED = 'RESERVED' 
exports.READY = 'READY'
exports.OUT = 'OUT'

let date = new Date();
date.setDate(date.getDate() + 7)

exports.RETURN_DATE = date