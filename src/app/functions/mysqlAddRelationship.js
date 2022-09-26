const mysqlApi = require('../apis/mysqlApi');
const digFunction = require('../functions/digFunction');

function mysqlAddRelationship(element, content, get_property, post_url) {

    content.forEach(async child => {
        //console.log('R CHILD ++++ ', child, element._id.toString())

        await mysqlApi.get(get_property).then(async resp => {

            var propertyMatch = resp.data.data.filter(function (chain) {
                return chain.name === child
            })

            if (propertyMatch.length > 0) {
                if (get_property === 'statuses') {
                    await mysqlApi.post(post_url,
                        {
                            type: 'status',
                            domain_id: element._id,
                            status_id: propertyMatch[0].id
                        },
                        {
                            headers: {
                                'content-type': 'text/json'
                            }
                        }
                    ).then(response => {
                        //console.log(child, ' added to MySQL database!')
                    }).catch(error => {
                        //console.log(error)
                        console.log(child, "error")
                    })
                }
                else if (get_property === 'nameservers') {

                    await digFunction(child, element.domain, async (response) => {

                        response = response.split(' ')
                        const statusIndex = response.indexOf("status:")
                        const status = response[statusIndex + 1].replace(',', '')

                        await mysqlApi.post(post_url,
                            {
                                type: 'nameserver',
                                domain_id: element._id,
                                nameserver_id: propertyMatch[0].id,
                                header_status: status
                            },
                            {
                                headers: {
                                    'content-type': 'text/json'
                                }
                            }
                        ).then(response => {
                            //console.log(child, ' added to MySQL database!')
                        }).catch(error => {
                            console.log(error)
                            //console.log(element.domain, "relationship creation error")
                        })

                    })
                }
            }

        }).catch(err => {
            console.log(err)
        })
    })

    console.log('Add Relationship ', get_property, new Date())

}

module.exports = mysqlAddRelationship