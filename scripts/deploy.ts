import { ethers } from "hardhat";

async function main() {


  const Voting = await ethers.deployContract("Voting");

  await Voting.waitForDeployment();

  console.log(
    `Voting deployed to ${Voting.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});