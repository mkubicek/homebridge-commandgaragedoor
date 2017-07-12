'use strict';

var Service, Characteristic;

module.exports = function (homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory('homebridge-commandgaragedoor', 'CommandGarageDoor', CommandGarageDoorAccessory);
};

class CommandGarageDoorAccessory {
  constructor (log, config) {
    this.log = log;

    this.command = config['command'];
    this.lastOpened = new Date();

    this.simulateTimeOpening = config['simulateTimeOpening'];
    this.simulateTimeOpen = config['simulateTimeOpen'];
    this.simulateTimeClosing = config['simulateTimeClosing'];

    var manufacturer = typeof config['manufacturer'] !== typeof undefined ? config['manufacturer'] : "default";
    var model = typeof config['model'] !== typeof undefined ? config['model'] : "default";
    var serialNumber = typeof config['serialnumber'] !== typeof undefined ? config['serialnumber'] : "default";

    this.service = new Service.GarageDoorOpener(config['name'], config['name']);
    this.setupOpenerService(this.service);

    this.informationService = new Service.AccessoryInformation();
    this.informationService
      .setCharacteristic(Characteristic.Manufacturer, manufacturer)
      .setCharacteristic(Characteristic.Model, model)
      .setCharacteristic(Characteristic.SerialNumber, serialNumber);
  }

  getServices () {
    return [this.informationService, this.service];
  }

  setupOpenerService (service) {
    this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
    this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);

    var that = this;
    service.getCharacteristic(Characteristic.TargetDoorState)
      .on('get', 
          (callback) => {
            var tds = service.getCharacteristic(Characteristic.TargetDoorState).value;
            callback(null, tds);
          })
      .on('set', 
          (value, callback) => {
            if (value === Characteristic.TargetDoorState.OPEN) {
              this.lastOpened = new Date();
              switch (service.getCharacteristic(Characteristic.CurrentDoorState).value) {
                case Characteristic.CurrentDoorState.CLOSED:
                case Characteristic.CurrentDoorState.CLOSING:
                case Characteristic.CurrentDoorState.OPEN:
                  this.openDoor(callback);
                  break;
                default:
                  callback();
              }
            } else {
              callback();
            }
          });
  }

  openDoor (callback) {
    this.simulateDoorOpening();
    var exec = require('child_process').exec;
    var cmd = this.command;
    exec(cmd, function(error, stdout, stderr) {
      this.log(stdout);
    }.bind(this));
  }

  simulateDoorOpening () {
    this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPENING);
    setTimeout(() => {
      this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.OPEN);
      setTimeout(() => {
        this.log("closing");
        this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSING);
        this.service.setCharacteristic(Characteristic.TargetDoorState, Characteristic.TargetDoorState.CLOSED);
        setTimeout(() => {
          this.service.setCharacteristic(Characteristic.CurrentDoorState, Characteristic.CurrentDoorState.CLOSED);
        }, this.simulateTimeClosing * 1000);
      }, this.simulateTimeOpen * 1000);
    }, this.simulateTimeOpening * 1000);
  }
}
