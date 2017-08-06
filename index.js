const awsIot = require('aws-iot-device-sdk');
const Gpio = require('chip-gpio').Gpio;
const config = require('./config.json');

console.log('Starting button app with config:');
console.log(JSON.stringify(config, null, 2));

var button1 = new Gpio(4, 'in', 'both', {
    debounceTimeout: 500
});
var button2 = new Gpio(5, 'in', 'both', {
    debounceTimeout: 500
});
var button3 = new Gpio(6, 'in', 'both', {
    debounceTimeout: 500
});

var device = awsIot.device({
    keyPath: config.iotKeyPath,
    certPath: config.iotCertPath,
    caPath: config.iotCaPath,
    clientId: config.iotClientId,
    region: config.iotRegion,
    host: config.iotEndpoint
});

button1.watch((err, value) => {
    if (err) {
        throw err;
    }
    console.log('Button 1 pressed', value);
});

button2.watch(function(err, value) {
    if (err) {
        throw err;
    }
    console.log('Button 2 pressed', value);
    // device.publish('chip_iotbutton/' + config.chipIoTMAC, JSON.stringify({
    //     "serialNumber": "7CC709B700F0",
    //     "batteryVoltage": "TODO",
    //     "clickType": "SINGLE",
    //     "button": "2"
    // }));
});

button3.watch((err, value) => {
    if (err) {
        throw err;
    }
    console.log('Button 3 pressed', value);
});

function exit() {
    button1.unexport();
    button2.unexport();
    button3.unexport();
    process.exit();
}

process.on('SIGINT', exit);