const mysqlApi = require('../apis/mysqlApi');

async function mysqlAddProperty(element, get_url, post_url) {

    await mysqlApi.get(get_url).then(resp => {

        element.forEach(async child => {

            var exist = resp.data.data.some(function (chain) {
                return chain.name === child
            })

            if (exist === false) {
                await mysqlApi.post(post_url,
                    {
                        name: child
                    },
                    {
                        headers: {
                            'content-type': 'text/json'
                        }
                    }
                ).then(response => {
                    console.log(child, ' added to MySQL database!')
                }).catch(error => {
                    console.log(child, "error")
                })
            }
        })

    }).catch(error => {
        console.log(error)
    })

    console.log('Add Property ', get_url, new Date())
}

module.exports = mysqlAddProperty