pragma solidity >=0.4.22 <0.6.0;
pragma experimental ABIEncoderV2; // Testing

contract Donations {

    struct Donation {
        string name;
        uint sender;
        string timestamp;
        uint amount;
    }

    struct Payment {
        uint receiver;
        uint timestamp;
        uint amount;
    }

    Donation[] donationCollection;
    Payment[] paymentCollection;
    //Holds user collection in storage for return function
    Donation[] userCollection;

    // enter a new donation
    function addDonation(string memory _name, string memory _sender, string memory _timestamp, uint _amount) public{
        uint encodedSender = uint(keccak256(abi.encodePacked(_sender)));
        Donation memory newDonation = Donation(_name, encodedSender, _timestamp, _amount);
        donationCollection.push(newDonation);
    }

    function makePayment(string memory _receiver, uint _timestamp, uint _amount) public{
        uint encodedReceiver = uint(keccak256(abi.encodePacked(_receiver)));
        Payment memory newPayment = Payment(encodedReceiver, _timestamp, _amount);
        paymentCollection.push(newPayment);
    }

    function getStructDonations() public view returns(Donation[] memory){
        return donationCollection;
    }

    function getStructPayments() public view returns(Payment[] memory){
        return paymentCollection;
    }

    function getUserDonations(string memory _sender) public returns(Donation[] memory){
        userCollection.length = 0;
        for (uint i = 0; i < donationCollection.length; i++) {
            if(uint(keccak256(abi.encodePacked((_sender)))) == donationCollection[i].sender){
                userCollection.push(donationCollection[i]);
            }
        }
        return userCollection;
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