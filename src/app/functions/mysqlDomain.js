const mysqlApi = require('../apis/mysqlApi');

function mysqlDomain(element, domain) {
    mysqlApi.get('domains').then(resp => {
        if (!resp.data.data.some(function (chain) {
            return chain.mongoId === element._id.toString()
        })) {
            mysqlApi.post('domain',
                {
                    mongoId: element._id,
                    domain,
                    available: 0,
                    backordered: 0
                },
                {
                    headers: {
                        'content-type': 'text/json'
                    }
                }
            ).then(response => {
                console.log(domain, ' added to MySQL database:', response.data.data)
            }).catch(error => {
                console.log(error)
            })
        }
        else
        {
            console.log(domain, ' already in MySQL database')
        }

    })
}

module.exports = mysqlDomain