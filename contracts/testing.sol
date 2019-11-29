pragma solidity >= 0.4.22 < 0.6.0;
pragma experimental ABIEncoderV2;

contract Testing {

    uint number;

    function setNumber (uint newNumber) public {
        number = newNumber;
    }

    function getNumber() public view returns(uint) {
        return number;
    }

    struct NumberObject {
        uint numbertje;
    }

    NumberObject[] public hetNummer;

    function setNummertje (uint _newNumber) public {
        NumberObject memory test = NumberObject(_newNumber);
        hetNummer.push(test);
    }

    function getNummertje() public view returns(NumberObject[] memory) {
        return hetNummer;
    }
}
