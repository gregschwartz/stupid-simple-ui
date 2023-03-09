const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GregGuestBook', function () {
  async function deployContractAndSetVariables() {
    const Factory = await ethers.getContractFactory('GregGuestBook');
    const gregGuestBook = await Factory.deploy();

    const [owner, otherUser] = await ethers.getSigners();

    const firstPost = "The genesis post";
    return { gregGuestBook, owner, otherUser, firstPost };
  }

  it('should deploy and set initial message', async function () {
    const { gregGuestBook, firstPost } = await loadFixture(deployContractAndSetVariables);
    expect(await gregGuestBook.getEntries()).to.eql([firstPost]);
  });

  it('add message works, getEntries returns initial and new values', async function () {
    const { gregGuestBook, firstPost } = await loadFixture(deployContractAndSetVariables);
    const secondPost = "Live long and prosper";

    await gregGuestBook.addEntry(secondPost);
    expect(await gregGuestBook.getEntries()).to.eql([firstPost, secondPost]);
  });
});
