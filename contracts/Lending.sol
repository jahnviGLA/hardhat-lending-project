// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TokenOne.sol";
import "./TokenTwo.sol";

contract Lending {
    TokenOne public token1;
    TokenTwo public token2;
    address public owner;

    mapping(address => uint256) public depositsToken1;
    mapping(address => uint256) public depositsToken2;

    constructor(address _token1, address _token2) {
        token1 = TokenOne(_token1);
        token2 = TokenTwo(_token2);
        owner = msg.sender;
    }

    // Deposit Token1 (assume user already sends tokens beforehand)
function depositToken1(uint256 amount) external {
    require(token1.balanceOf(address(this)) >= amount, "Contract lacks token");
    depositsToken1[msg.sender] += amount;
}

// Deposit Token2 (same logic)
function depositToken2(uint256 amount) external {
    require(token2.balanceOf(address(this)) >= amount, "Contract lacks token");
    depositsToken2[msg.sender] += amount;
}

    // Borrowing Token2 against Token1 (max: collateral * 2 * 70%)
    function borrowToken2(uint256 amount) external {
        uint256 maxBorrow = depositsToken1[msg.sender] * 2 * 70 / 100;
        require(amount <= maxBorrow, "Exceeds borrow limit");
        require(token2.balanceOf(address(this)) >= amount, "Not enough Token2 in contract");
        token2.transfer(msg.sender, amount);
    }

    // Borrowing Token1 against Token2 (max: collateral * 0.7 / 2)
    function borrowToken1(uint256 amount) external {
        uint256 maxBorrow = depositsToken2[msg.sender] * 70 / 100 / 2;
        require(amount <= maxBorrow, "Exceeds borrow limit");
        require(token1.balanceOf(address(this)) >= amount, "Not enough Token1 in contract");
        token1.transfer(msg.sender, amount);
    }

    // Only owner can withdraw all tokens
    function withdrawAll() external {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 bal1 = token1.balanceOf(address(this));
        uint256 bal2 = token2.balanceOf(address(this));
        if (bal1 > 0) token1.transfer(owner, bal1);
        if (bal2 > 0) token2.transfer(owner, bal2);
    }
}