// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Greeter {
    string public greeting = "Hello!";

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreet(string memory _greeting) public {
        greeting = _greeting;
    }
}
