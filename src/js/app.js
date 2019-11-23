App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    $.getJSON('../driver.json', function(data) {
      var driverRow = $('#petsRow');
      var driverTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        driverTemplate.find('img').attr('src', data[i].pictures);
        driverTemplate.find('.pet-age').text(data[i].name);
        driverTemplate.find('.pet-location').text(data[i].time);
        driverTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        

        driverRow.append(driverTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('DriverP.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var DriverArtifact = data;
      App.contracts.contrat_driver = TruffleContract(DriverArtifact);
    
      // Set the provider for our contract
      App.contracts.contrat_driver.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markDriver();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleDriver);
  },

  markDriver: function(drivers, account) {
    var driverInstance;

    App.contracts.contrat_driver.deployed().then(function(instance) {
      driverInstance = instance;
    
      return driverInstance.getDriver.call();
    }).then(function(drivers) {
      for (i = 0; i < drivers.length; i++) {
        if (drivers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleDriver: function(event) {
    event.preventDefault();

    var driverId = parseInt($(event.target).data('id'));
    var driverInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.DriverP.deployed().then(function(instance) {
    driverInstance = instance;

    // Execute adopt as a transaction by sending account
    return driverInstance.gDriver(driverId, {from: account});
  }).then(function(result) {
    return App.markDriver();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});


