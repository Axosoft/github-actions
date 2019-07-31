import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

async function run() {
  const authToken = core.getInput('authToken');
  const boardID = core.getInput('boardID');
  const cardID = core.getInput('cardID');

  core.debug(`auth: ${authToken}`);
  core.debug(`token len: ${authToken.length}`);
  core.debug(`matches: ${authToken === 'pd899c05b2538cbc64fb7c2c68cc279fe9239b3e2'}`);

  try {
    await GloSDK(authToken).boards.cards.comments.create(boardID, cardID, {
      text: 'hello from GH actions'
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
