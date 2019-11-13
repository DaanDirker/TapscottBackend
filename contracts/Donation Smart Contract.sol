pragma solidity >=0.4.22 <0.6.0;

contract Donations {
    
    struct Donation {
        string sender;
        string receiver;
        uint timestamp;
        uint amount;
    }
    
    Donation[] donationCollection;
    
    mapping (address => Donation[]) public DonationAddress;
    
    // enter a new donation
    function addDonation(string memory _sender, string memory _receiver, uint _timestamp, uint _amount) public{
        Donation memory newDonation = Donation(_sender, _receiver, _timestamp, _amount);
        donationCollection.push(newDonation);
        DonationAddress[msg.sender].push(newDonation);
    }
    
    //return all donations
    function getDonations() public view returns(uint[] memory){
        // return donationCollection;
        uint256[] memory sum = new uint256[](donationCollection.length);
        for (uint i = 0; i < donationCollection.length; i++) {
            sum[i] = donationCollection[i].amount;
        } 
        return sum;
    }
    
    //return all user donations
    function getUserDonations() public view returns(uint[] memory, uint[] memory){
        // return DonationAddress[msg.sender];
        uint256[] memory sum = new uint256[](DonationAddress[msg.sender].length);
        uint256[] memory timesum = new uint256[](DonationAddress[msg.sender].length);
        for (uint i = 0; i < DonationAddress[msg.sender].length; i++) {
            sum[i] = DonationAddress[msg.sender][i].amount;
            timesum[i] = DonationAddress[msg.sender][i].timestamp;
        }
        return (sum, timesum);
    }
    
    function returnEncodedStruct() public view returns(bytes32) {
        Donation memory don = donationCollection[0];
        return keccak256(abi.encode(don.sender, don.receiver, don.timestamp, don.amount));
    }
    
    //Check total donation amount
    function calculateTotalDonationAmount() public view returns(uint){
        uint sum = 0;
        for (uint i = 0; i < donationCollection.length; i++) {
            sum += donationCollection[i].amount;
        }
        return sum;
    }
}