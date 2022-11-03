const whois = require('whois-json')

async function whoisFunction(domain, callback) {
    try {

        if (typeof domain === 'undefined')
            return ({ error: 'No domain received' })

        if (domain.includes(".br"))
            return ({ error: 'TLD is not supported' })

        //console.log(`Analyzing ${domain}`)

        var resWhois = await whois(`${domain}`, { follow: 3, verbose: true });

        if (resWhois.length < 2)
            return ({
                message: 'Possibly not registered',
                availability: true
            })

        const domainStatuses = []
        const nameservers = []

        resWhois.forEach(element => {
            var statusPart = element.data.domainStatus.toLowerCase().split(" ")

            statusPart.forEach(element => {
                if (element.startsWith('http') === false && element.startsWith('(http') === false)
                    if (domainStatuses.indexOf(element) === -1)
                        domainStatuses.push(element)
            })

            var nameserversPart = element.data.nameServer.toLowerCase().split(" ")

            nameserversPart.forEach(element => {
                if (nameservers.indexOf(element) === -1)
                    nameservers.push(element)
            })
        })

        nameservers.forEach(element => {
            // dig(element, domain)
        })

        return ({
            domain,
            message: 'Currently registered',
            //availability: false,
            registrar: resWhois[0].data.registrar,
            registrationDate: resWhois[0].data.creationDate.replace(/T/, ' ').replace(/\..+/, ''),
            expirationDate: resWhois[0].data.registryExpiryDate.replace(/T/, ' ').replace(/\..+/, ''),
            status: domainStatuses,
            nameservers: nameservers,
            dnnssec: resWhois[0].data.dnssec
        })
    } catch (err) {
        console.log(err)
        return ({ error: 'Something went wrong' })
    }
}

module.exports = whoisFunction