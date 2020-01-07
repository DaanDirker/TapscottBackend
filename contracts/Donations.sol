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

    struct PaymentObject {
        uint transport;
        uint labor;
        uint fishingNets;
        uint boatRental;
        uint bank;
        uint total;
    }

    uint constant IBAN1_TRANSPORT = 71483434822557954811414208117486581150426872837138488758230305104170717921995;
    uint constant IBAN2_LABOR = 24876886716447363185588813355746526635635194205268490312410266622053044284305;
    uint constant IBAN3_FISHING_NETS = 21101672275253988548001904242265822070105250070583967579935560498662065541434;
    uint constant IBAN4_BOAT_RENTAL = 108225485566937822872576597874002787108276722130336665161358893314090900759191;
    uint constant IBAN5_BANK = 50384645994308965417808879872058743009792248571523618537638218895414707210992;

    //Constant value for amount of returns
    uint constant latestAmount = 10;

    Donation[] donationCollection;
    Payment[] paymentCollection;

    //Stores the total amounts for each category
    PaymentObject paymentObject;

    //Holds collections in storage for return functions
    Donation[] userCollection;
    Donation[] latestDonationCollection;
    Payment[] latestPaymentCollection;

    // enter a new donation
    function addDonation(string memory _name, string memory _sender, string memory _timestamp, uint _amount) public{
        uint encodedSender = uint(keccak256(abi.encodePacked(_sender)));
        Donation memory newDonation = Donation(_name, encodedSender, _timestamp, _amount);
        donationCollection.push(newDonation);

        // incrementing category on payment creation
        if(uint(keccak256(abi.encodePacked((_sender)))) == IBAN1_TRANSPORT){
            paymentObject.transport += _amount;
        }else if(uint(keccak256(abi.encodePacked((_sender)))) == IBAN2_LABOR){
            paymentObject.labor += _amount;
        }else if(uint(keccak256(abi.encodePacked((_sender)))) == IBAN3_FISHING_NETS){
            paymentObject.fishingNets += _amount;
        }else if(uint(keccak256(abi.encodePacked((_sender)))) == IBAN4_BOAT_RENTAL){
            paymentObject.boatRental += _amount;
        }else if(uint(keccak256(abi.encodePacked((_sender)))) == IBAN5_BANK){
            paymentObject.bank += _amount;
        }
        paymentObject.total += _amount;
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
        if (donationCollection.length <= latestAmount) {
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

    function _incrementPaymentCategory(string memory _bank, uint _amount) public {
        string memory bankAccount = _bank;
        if(uint(keccak256(abi.encodePacked((bankAccount)))) == IBAN1_TRANSPORT){
            paymentObject.transport += _amount;
        }else if(uint(keccak256(abi.encodePacked((bankAccount)))) == IBAN2_LABOR){
            paymentObject.labor += _amount;
        }else if(uint(keccak256(abi.encodePacked((bankAccount)))) == IBAN3_FISHING_NETS){
            paymentObject.fishingNets += _amount;
        }else if(uint(keccak256(abi.encodePacked((bankAccount)))) == IBAN4_BOAT_RENTAL){
            paymentObject.boatRental += _amount;
        }else if(uint(keccak256(abi.encodePacked((bankAccount)))) == IBAN5_BANK){
            paymentObject.bank += _amount;
        }
        paymentObject.total += _amount;
    }

    function getPaymentObject() public view returns(PaymentObject memory){
        return paymentObject;
    }
}