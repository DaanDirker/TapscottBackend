pragma solidity >= 0.4.22 < 0.6.0;

contract Testing {
    
    uint number;
    
    function setNumber (uint newNumber) public {
        number = newNumber;
    }
    
    function getNumber() public view returns(uint) {
        return number;
    }
}
