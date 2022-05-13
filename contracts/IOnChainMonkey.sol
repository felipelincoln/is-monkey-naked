// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

interface IOnChainMonkey {
    function getAttributes(uint256 tokenId_) external view returns (string memory);
}
