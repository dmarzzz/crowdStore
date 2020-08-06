
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Push is ERC721 {
     using Counters for Counters.Counter;
     Counters.Counter private _id;

     uint256[] public txid; 
     mapping(string => address) public addressbook;
     mapping(uint256 => string) public txbook;


    constructor() ERC721("Push", "PSH") public {
    }

    function mint(string memory  fil_addy, string memory  fil_tx) public returns (uint256){
        _id.increment();


        uint256 tId = _id.current();
        address to = addressbook[fil_addy];
        txbook[tId] = fil_tx;
        _mint(to, tId);

        return tId;

    }

    function associateFiladdress(string memory fil_addy) public {
        addressbook[fil_addy] = msg.sender;
    }

    function getFiladdress(string calldata file_addy) external view returns (address){
        return addressbook[file_addy];
    }

}