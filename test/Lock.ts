const { expect } = require("chai");

describe("Voting", function () {
  let Voting;
  let voting;
  let inec;
  let voter1;

  beforeEach(async function () {
    Voting = await ethers.getContractFactory("Voting");
    [inec, voter1] = await ethers.getSigners();
    voting = await Voting.deploy();
    // await voting.deployed();
  });

  it("should allow admin to add voters", async function () {
    await voting.connect(inec).addVoters([voter1.address]);
    expect(await voting.voters(voter1.address)).to.equal(true);
  });

  it("should allow admin to create a ballot", async function () {
    await voting
      .connect(inec)
      .createBallot("Ballot 1", ["Choice 1", "Choice 2"]);
    const ballot = await voting.ballots(0);
    expect(ballot.name).to.equal("Ballot 1");
    // expect(ballot.choices.length).to.equal(2);
  });

  it("should allow voters to cast their votes", async function () {
    await voting.connect(inec).addVoters([voter1.address]);
    await voting
      .connect(inec)
      .createBallot("Ballot 1", ["Choice 1", "Choice 2"]);
    await voting.connect(voter1).vote(0, 0);
    const choices = await voting.results(0);
    expect(choices[0].votes).to.equal(1);
    expect(choices[1].votes).to.equal(0);
  });

  it("should allow viewing results after the end of the ballot", async function () {
    await voting.connect(inec).addVoters([voter1.address]);
    await voting
      .connect(inec)
      .createBallot("Ballot 1", ["Choice 1", "Choice 2"]);
    
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const choices = await voting.results(0);
    expect(choices.length).to.equal(2);
  });
});