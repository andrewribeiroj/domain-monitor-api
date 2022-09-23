const dig = require('dns')
const { exec } = require('child_process')
const { stat } = require('fs')

function digFunction(ns, domain, callback) {

    try {

        let command = "dig @"
        command += ns + " " + domain

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            } 
            
            callback(stdout)
        });
        

    } catch (err) {
        console.log(err)
        return ({ error: 'Something went wrong' })
    }

}

module.exports = digFunction