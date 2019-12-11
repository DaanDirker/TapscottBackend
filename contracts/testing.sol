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
        uint number;
    }

    NumberObject[] public numberObject;

    function setNumberObject (uint _newNumber) public {
        numberObject.push(NumberObject(_newNumber));
    }

    function getNumberObject() public view returns(NumberObject[] memory) {
        return numberObject;
    }
}
