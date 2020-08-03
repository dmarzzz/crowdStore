// SPDX-License-Identifier: MIT
pragma solidity ^0.6.9;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/drafts/Counters.sol";




contract Push is Ownable, ERC721Full {
     using Counters for Counters.Counter;
     Counters.Counter private _id;

 constructor() ERC721Full("Push", "PSH") public {
 }
    function mint(address to) public onlyOwner{
         _id.increment();


         uint256 tId = _id.current();
         _mint(to, tId);

        return tId;
    }


}
