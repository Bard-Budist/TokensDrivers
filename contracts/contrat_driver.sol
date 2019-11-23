pragma solidity ^0.5.0;

contract DriverP {
    address[4] public Drivers;

    function gDriver(uint driverId) public returns (uint) {
    require(driverId >= 0 && driverId <= 4);

    Drivers[driverId] = msg.sender;

    return driverId;
    }

 function getDriver() public view returns (address[4] memory) {
  return Drivers;
 }
}