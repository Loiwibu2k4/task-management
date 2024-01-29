module.exports.success = (res, message, info, value) => {
    let object = {
        code: 200,
        message: !message ? "Success !" : message
    }
    if (info) {
        object["result"] = {
            key: info,
            value
        }
    }
    return res.json(object);
}
module.exports.error = (res, message) => (
    res.json({
        code: 400,
        message: !message ? "Error !" : message
    })
)

module.exports.registerSuccess = (res) => (
    res.json({
        code: 1000,
        message: "Register Success !"
    })
)

module.exports.registerFail = (res) => (
    res.json({
        code: 1200,
        message: "Register Fail !"
    })
)

module.exports.existEmail = (res) => {
    res.json({
        code: 1400,
        message: "Has Exist Email"
    })
}