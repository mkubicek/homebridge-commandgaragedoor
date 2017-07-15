# homebridge-commandgaragedoor
Garage Door Opener plugin for [Homebridge](https://github.com/nfarina/homebridge).

Executes a shell command taking care of opening a door.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-commandgaragedoor`
3. Update your configuration file. See the sample below.

## Updating

- `npm update -g homebridge-commandgaragedoor`

## Configuration

| Key | Description |
| ------------- |-------------|
| name     | default accessory name |
| command     | shell command to execute |
| simulateTimeOpening     | Time in seconds displaying 'opening' state after open triggered |
| simulateTimeOpen     | Time in seconds displaying 'open' state after 'opening' state |
| simulateTimeClosing     | Time in seconds showing 'closing' state after 'open' state   |
| manufacturer     | Manufacturer entry in iOS Home® |
| model     | Model entry in iOS Home® |
| serialnumber     | Serial Number entry in iOS Home® |
  
### Sample Configuration

```json
  "accessories": [{
      "name": "Sample Garage Door",
      "command": "python ~/opendoor.py",
      "simulateTimeOpening": 3,
      "simulateTimeOpen": 5,
      "simulateTimeClosing": 2,
      "manufacturer": "selfmade",
      "model": "model x",
      "serialnumber": "y"
  }]
```

# Credit

The original work was done by plasticrake in his [homebridge-real-fake-garage-doors](https://github.com/plasticrake/homebridge-real-fake-garage-doors) project.
