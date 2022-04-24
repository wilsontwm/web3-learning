//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract SimpleToken {
    uint256 public supply;
    address public owner;
    mapping(address => uint256) private balances; // To track the balance of each user

    constructor() {
        owner = msg.sender;
        supply = msg.sender.balance;
    }

    event Topup(address from, uint256 amount);
    event Sent(address from, address to, uint256 amount);
    event Withdrew(address to, uint256 amount);

    // Only for minter of the contract
    modifier onlyMinter() {
        require(msg.sender == owner, "Only minter can call this function");
        _;
    }

    // Check if the amount keyed in is sufficient
    modifier checkBalance(uint256 amount) {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        _;
    }

    // Get the balance of the current user
    function getBalance() external view returns (uint256) {
        return balances[msg.sender];
    }

    // Topup amount into the balance
    function topup() public payable {
        balances[msg.sender] += msg.value;
        emit Topup(msg.sender, msg.value);
    }

    // Send token to a specified receiver
    function send(address receiver, uint256 amount)
        public
        checkBalance(amount)
    {
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }

    // Withdraw token
    function withdraw(uint256 amount) public checkBalance(amount) {
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdrew(msg.sender, amount);
    }
}
