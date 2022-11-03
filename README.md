# domain-monitor-api
NodeJS API to monitor domains' statuses and generate warnings for subscribers.

## Routes

/auth/register
/auth/authenticate
/auth/forgot_password
/auth/reset_password

/dig/:domain?/:type? - GET - mandatory type: fulldata/ns-validation

/monitor/:domain? - GET

/whois/:domain?/:type? - GET - optional type: fulldata

/notifications/ - GET
/notifications/ - POST
/notifications/:notificationId - GET
/notifications/:notificationId - PUT
/notifications/:notificationId - DELETE

/statuses/ - GET
/statuses/ - POST
/statuses/:statusId - GET
/statuses/:statusId - PUT
/statuses/:statusId - DELETE