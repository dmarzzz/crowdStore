pragma solidity ^0.6.0;

//A crowd store = CID and ETH

// Rough Process Flow
// 1. Start a crowdStore
// 2. Upload CID
// 3. Accept funding for CID

contract crowdStore {

    //Creator can switch document funding state
    enum fundingStatus { Open , Closed}

    address public owner;

    uint256 CID;

    uint256 depositTotal;

    uint256 fixedETHtoWFILRate = 0.1;

    mapping (adress => uint) deposits;

    function crowdStore( uint amount ) payable external {

        if (balances[msg.sender] < amount) return;
        depositTotal += amount;
        // deposits[msg.sender] 
    }

    function() external payable  {}

    function triggerWFILPurchase()  external {}
}