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
        string timestamp;
        uint amount;
    }

    //Constant value for amount of returns
    uint constant latestAmount = 10;

    Donation[] donationCollection;
    Payment[] paymentCollection;

    //Holds collections in storage for return functions
    Donation[] userCollection;
    Donation[] latestDonationCollection;
    Payment[] latestPaymentCollection;

    // enter a new donation
    function addDonation(string memory _name, string memory _sender, string memory _timestamp, uint _amount) public{
        uint encodedSender = uint(keccak256(abi.encodePacked(_sender)));
        Donation memory newDonation = Donation(_name, encodedSender, _timestamp, _amount);
        donationCollection.push(newDonation);
    }

    function makePayment(string memory _receiver, string memory _timestamp, uint _amount) public{
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

    function getlatestDonations() public returns(Donation[] memory){
        if(donationCollection.length <= latestAmount) {
            return donationCollection;
        } else {
            latestDonationCollection.length = 0;
            for (uint i = donationCollection.length - 1; i >= (donationCollection.length - latestAmount); i--) {
                latestDonationCollection.push(donationCollection[i]);
            }
            return latestDonationCollection;
        }
    }

    function getlatestPayments() public returns(Payment[] memory){
        if (paymentCollection.length <= latestAmount) {
            return paymentCollection;
        } else {
            latestPaymentCollection.length = 0;
            for (uint i = paymentCollection.length - 1; i >= (paymentCollection.length - latestAmount); i--) {
                latestPaymentCollection.push(paymentCollection[i]);
            }
            return latestPaymentCollection;
        }
    }

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