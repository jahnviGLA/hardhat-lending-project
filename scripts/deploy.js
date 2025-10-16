async function main() {
  const [deployer, addr1, addr2] = await ethers.getSigners();

  const Token1 = await ethers.getContractFactory("Token1");
  const Token2 = await ethers.getContractFactory("Token2");

  const token1 = await Token1.deploy(ethers.utils.parseUnits("1000", 18));
  const token2 = await Token2.deploy(ethers.utils.parseUnits("1000", 18));
  await token1.deployed();
  await token2.deployed();

  const Lending = await ethers.getContractFactory("Lending");
  const lending = await Lending.deploy(token1.address, token2.address);
  await lending.deployed();

  console.log("Token1:", token1.address);
  console.log("Token2:", token2.address);
  console.log("Lending contract:", lending.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
