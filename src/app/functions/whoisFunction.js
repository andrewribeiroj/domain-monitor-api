const whois = require('whois-json')

async function whoisFunction(domain) {
    try {
        
        var resWhois = await whois(`${domain}`, {follow: 3, verbose: true});

        if(resWhois.length < 2)
            return ({
                message: 'Possibly not registered',
                availability: true
            })

        const domainStatuses = []

        resWhois.forEach(element => {
            if(typeof element.data.domainStatus !== 'undefined'){
                element.data.domainStatus.toLowerCase()

                var statusPart = element.data.domainStatus.split(" ")

                statusPart.forEach(element => {
                    if(element.startsWith('http') === false && element.startsWith('(http') === false)
                        if(domainStatuses.indexOf(element) === -1)
                            domainStatuses.push(element)
                })
            }
        })

        return ({
            message: 'Currently registered',
            availability: false,
            statuses: domainStatuses
        })
    } catch (err) {
        console.log(err)
        return ({ error: 'Something went wrong' })
    }
}

module.exports = whoisFunction