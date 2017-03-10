pragma solidity ^0.4.2;

contract Login {
  
    event LoginAttempt(address sender, string challenge);

    function login(string challenge) {
        LoginAttempt(msg.sender, challenge);
    }

}
