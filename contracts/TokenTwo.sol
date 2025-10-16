// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenTwo {
    string public name = "TokenTwo";
    string public symbol = "TK2";
    uint256 public totalSupply = 20000;
    address public owner;

    mapping(address => uint256) public balances;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Not enough balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }

    function approve(address spender, uint256 amount) external {}
}