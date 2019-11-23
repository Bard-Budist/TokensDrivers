pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/contrat_driver.sol";

contract TestDrivers {
  // The address of the adoption contract to be tested
  DriverP driverP = DriverP(DeployedAddresses.DriverP());
  // Testing the adopt() function
    function testUserCanDriver() public {
    uint returnedId = driverP.gDriver(expectedDriverId);

    Assert.equal(returnedId, expectedDriverId, "Driver what is returned.");
    }

    function testGetDriversAddressByPetId() public {
  address driver = DriverP.Drivers(expectedDriverId);

  Assert.equal(driver, expectedDriver, "Owner of the expected pet should be this contract");
}
function testGetDriverAddressByDriverIdInArray() public {
  // Store adopters in memory rather than contract's storage
  address[4] memory Drivers = DriverP.getDriver();

  Assert.equal(Drivers[expectedDriverId], expectedDriver, "Owner of the expected pet should be this contract");
}
  // The id of the pet that will be used for testing
  uint expectedDriverId = 2;

  //The expected owner of adopted pet is this contract
  address expectedDriver = address(this);

}
