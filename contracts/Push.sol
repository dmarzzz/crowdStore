
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract Push is Ownable, ERC721 {
     using Counters for Counters.Counter;
     Counters.Counter private _id;

 constructor() ERC721("Push", "PSH") public {
 }
    function mint(address to) public onlyOwner returns (uint256){
         _id.increment();


         uint256 tId = _id.current();
         _mint(to, tId);

        return tId;
    }


}
