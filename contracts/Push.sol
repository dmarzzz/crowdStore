// SPDX-License-Identifier: MIT
pragma solidity ^0.6.9;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";



contract Push is ERC721Full {
 constructor() ERC721Full("Push", "PSH") public {
  
function mint(address to, uint256 projectid)) public {

    _mint(to, projectid);
        }
    }

}
