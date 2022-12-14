// Availability Checker
const checkAvailability = require('./mainCron')

class CronManager {
    constructor(){
        this.jobs = [checkAvailability]
    }

    run(){
        this.jobs.forEach(job => job.start())
    }

    stop(){
        this.jobs.forEach(job => job.stop())
    }
}

module.exports = new CronManager()