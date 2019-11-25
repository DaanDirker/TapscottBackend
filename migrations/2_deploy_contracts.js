const Donations = artifacts.require("Donations");
const Testing = artifacts.require("Testing");

module.exports = function(deployer) {
  deployer.deploy(Donations);
  deployer.deploy(Testing);
};
