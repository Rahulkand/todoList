module.exports.getDate =function()
{
    var today = new Date();
    options = {
        weekday: 'long', month: 'long', day: 'numeric'
    }
    let currentday = today.toLocaleDateString("en-US",options);
    return currentday;
}
module.exports.getDay = getDay;
function getDay()
{
    var today = new Date();
    options = {
        weekday: 'long',
    }
    let currentday = today.toLocaleDateString("en-US",options);
    return currentday;
}
console.log(module.exports)