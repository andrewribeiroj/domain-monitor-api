const mysqlApi = require('../apis/mysqlApi');

async function mysqlAddDomain(element, result, available = 0, backordered = 0) {

    await mysqlApi.get('domains').then(async resp => {
        if (!resp.data.data.some(function (chain) {
            return chain.mongoId === element._id.toString()
        })) {
            await mysqlApi.post('domain',
                {
                    mongoId: element._id,
                    domain: result.domain,
                    registrationDate: result.registrationDate.replace('Z', ''),
                    expirationDate: result.expirationDate.replace('Z', ''),
                    available,
                    backordered
                },
                {
                    headers: {
                        'content-type': 'text/json'
                    }
                }
            ).then(response => {
                return response.data.data.id
            }).catch(error => {
                console.log(error)
            })
        }
        else {
            return resp.data.data.id
        }

    }).catch(error => {
        console.log(error)
    })

    console.log('Add Domain ', new Date())

}

module.exports = mysqlAddDomain