const https = require('https')
const dnsServer = 'https://dns.google/'

function digFunction(type, domain, callback) {
    
    try {

        https.get(`${dnsServer}/resolve?name=${domain}&type=${type}&cd=true`, (ans) => {

            if (ans.statusCode != 200){
                callback(ans.statusCode)

            } else {
   
                let data = '';
                
                ans.on('data', (chunk) => {
                    data += chunk
                })
                
                ans.on('end', () => {
                    callback(JSON.parse(data))
                })
            }
        })

    } catch (err) {
        console.log(err)
        return ({ error: 'Something went wrong' })
    }

}

module.exports = digFunction