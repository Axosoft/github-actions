import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

async function run() {
  const authToken = core.getInput('authToken');
  const boardID = core.getInput('boardID');
  const cardID = core.getInput('cardID');

  try {
    await GloSDK(authToken).boards.cards.comments.create(boardID, cardID, {
      text: 'hello from GH actions'
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
