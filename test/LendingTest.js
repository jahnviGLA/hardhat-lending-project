const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lending System Demo (TokenOne & TokenTwo)", function () {
  let token1, token2, lending;
  let owner, addr1, addr2;

  async function logBalances(stage) {
    const balances = {
      owner: {
        token1: (await token1.balanceOf(owner.address)).toString(),
        token2: (await token2.balanceOf(owner.address)).toString(),
      },
      addr1: {
        token1: (await token1.balanceOf(addr1.address)).toString(),
        token2: (await token2.balanceOf(addr1.address)).toString(),
      },
      addr2: {
        token1: (await token1.balanceOf(addr2.address)).toString(),
        token2: (await token2.balanceOf(addr2.address)).toString(),
      },
      lending: {
        token1: (await token1.balanceOf(lending.address)).toString(),
        token2: (await token2.balanceOf(lending.address)).toString(),
      }
    };
    console.log(`\n--- ${stage} ---`);
    console.log(`Owner:   Token1=${balances.owner.token1}, Token2=${balances.owner.token2}`);
    console.log(`Addr1:   Token1=${balances.addr1.token1}, Token2=${balances.addr1.token2}`);
    console.log(`Addr2:   Token1=${balances.addr2.token1}, Token2=${balances.addr2.token2}`);
    console.log(`Lending: Token1=${balances.lending.token1}, Token2=${balances.lending.token2}`);
  }

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const Token1 = await ethers.getContractFactory("TokenOne");
    token1 = await Token1.deploy();
    await token1.deployed();

    const Token2 = await ethers.getContractFactory("TokenTwo");
    token2 = await Token2.deploy();
    await token2.deployed();

    const Lending = await ethers.getContractFactory("Lending");
    lending = await Lending.deploy(token1.address, token2.address);
    await lending.deployed();

    // Distribute tokens
    await token1.transfer(addr1.address, 500);
    await token2.transfer(addr2.address, 1000);
    await token1.transfer(lending.address, 2000);
    await token2.transfer(lending.address, 4000);

    await logBalances("Initial balances after setup");
  });

  it("Address1 deposits TokenOne and borrows TokenTwo", async function () {
    await logBalances("Before Addr1 deposit/borrow");

    await token1.connect(addr1).transfer(lending.address, 100);
    await lending.connect(addr1).depositToken1(100);

    await logBalances("After Addr1 deposits 100 TokenOne");

    await lending.connect(addr1).borrowToken2(140);

    await logBalances("After Addr1 borrows 140 TokenTwo");

    expect(Number(await token2.balanceOf(addr1.address))).to.equal(140);
  });

  it("Address2 deposits TokenTwo and borrows TokenOne", async function () {
    await logBalances("Before Addr2 deposit/borrow");

    await token2.connect(addr2).transfer(lending.address, 200);
    await lending.connect(addr2).depositToken2(200);

    await logBalances("After Addr2 deposits 200 TokenTwo");

    await lending.connect(addr2).borrowToken1(70);

    await logBalances("After Addr2 borrows 70 TokenOne");

    expect((await token1.balanceOf(addr2.address)).toNumber()).to.equal(70);
  });

  it("Owner withdraws all tokens from Lending contract", async function () {
    await logBalances("Before owner withdrawAll");
    await lending.connect(owner).withdrawAll();
    await logBalances("After owner withdrawAll");

   expect(Number(await token1.balanceOf(owner.address))).to.equal(9500);
expect(Number(await token2.balanceOf(owner.address))).to.equal(19000);
  });
});