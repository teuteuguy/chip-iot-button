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

var message = {
    "serialNumber": "7CC709B700F0",
    "batteryVoltage": "TODO",
    "clickType": "SINGLE",
    "button": "2"
};
var topic = 'chip_iotbutton/' + config.chipIoTMAC;

button1.watch((err, value) => {
    if (err) {
        throw err;
    }
    console.log('Button 1 pressed', value);
    message.button = 1;
    device.publish(topic, JSON.stringify(message));
});

button2.watch(function(err, value) {
    if (err) {
        throw err;
    }
    console.log('Button 2 pressed', value);
    message.button = 2;
    device.publish(topic, JSON.stringify(message));
});

button3.watch((err, value) => {
    if (err) {
        throw err;
    }
    console.log('Button 3 pressed', value);
    message.button = 3;
    device.publish(topic, JSON.stringify(message));
});

function exit() {
    button1.unexport();
    button2.unexport();
    button3.unexport();
    process.exit();
}

process.on('SIGINT', exit);