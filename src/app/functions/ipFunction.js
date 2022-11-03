const { IPinfoWrapper } = require("node-ipinfo")

const ipinfo = new IPinfoWrapper(process.env.IP_TOKEN)

function ipFunction(ip){

    ipinfo.lookupIp(ip).then((response) => {
        callback(response)
    })

}

module.exports = ipFunction