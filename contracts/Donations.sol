pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2; // Testing

contract Donations {

    struct Donation {
        string name;
        uint sender;
        uint timestamp;
        uint amount;
    }

    struct Payment {
        uint receiver;
        uint timestamp;
        uint amount;
    }

    struct NumberObject {
        uint numbertje;
    }

    NumberObject[] hetNummer;

    Donation[] donationCollection;
    Payment[] paymentCollection;

    function setNummertje (uint _newNumber) public {
        hetNummer.push(NumberObject(_newNumber));
    }

    function getNummertje() public view returns(NumberObject[] memory) {
        return hetNummer;
    }

    // enter a new donation
    function addDonation(string memory _name, string memory _sender, uint _timestamp, uint _amount) public{
        uint encodedSender = uint(keccak256(abi.encodePacked(_sender)));
        // Donation memory newDonation = Donation(_name, encodedSender, _timestamp, _amount);
        donationCollection.push(Donation(_name, encodedSender, _timestamp, _amount));
    }

    function makePayment(string memory _receiver, uint _timestamp, uint _amount) public{
        // uint encodedReceiver = uint(keccak256(abi.encodePacked(_receiver)));
        // Payment memory newPayment = Payment(123, _timestamp, _amount);
        paymentCollection.push(Payment(123, _timestamp, _amount));
    }

    //return all donations
    function getDonationsSum() public view returns(uint[] memory){
        // return donationCollection;
        uint256[] memory sum = new uint256[](donationCollection.length);
        for (uint i = 0; i < donationCollection.length; i++) {
            sum[i] = donationCollection[i].amount;
        }
        return sum;
    }

    function getStructDonations() public view returns(Donation[] memory){
        return donationCollection;
    }

    function getStructPayments() public view returns(Payment[] memory){
        return paymentCollection;
    }

    //return all user donations
    // function getUserDonations() public view returns(uint[] memory, uint[] memory){
    //     // return DonationAddress[msg.sender];
    //     uint256[] memory sum = new uint256[](DonationAddress[msg.sender].length);
    //     uint256[] memory timesum = new uint256[](DonationAddress[msg.sender].length);
    //     for (uint i = 0; i < DonationAddress[msg.sender].length; i++) {
    //         sum[i] = DonationAddress[msg.sender][i].amount;
    //         timesum[i] = DonationAddress[msg.sender][i].timestamp;
    //     }
    //     return (sum, timesum);
    // }

    function getUserDonations(string memory _sender) public view returns(uint[] memory){
        uint256[] memory sum = new uint256[](donationCollection.length);
        for (uint i = 0; i < donationCollection.length; i++) {
            // if(keccak256(abi.encodePacked((_sender))) == keccak256(abi.encodePacked((donationCollection[i].sender)))){
            if(uint(keccak256(abi.encodePacked((_sender)))) == donationCollection[i].sender){
                sum[i] = donationCollection[i].amount;
            }
        }
        return sum;
    }

    function returnEncodedStruct() public view returns(bytes32) {
        Donation memory don = donationCollection[0];
        return keccak256(abi.encode(don.sender, don.timestamp, don.amount));
    }

    //Check total donation amount
    function calculateTotalDonationAmount() public view returns(uint){
        uint sum = 0;
        for (uint i = 0; i < donationCollection.length; i++) {
            sum += donationCollection[i].amount;
        }
        return sum;
    }

    function calculateTotalPaymentAmount() public view returns(uint){
        uint sum = 0;
        for (uint i = 0; i < paymentCollection.length; i++) {
            sum += paymentCollection[i].amount;
        }
        return sum;
    }
}