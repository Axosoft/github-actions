import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

async function run() {
  const authToken = core.getInput('authToken');
  const boardID = core.getInput('boardID');
  const cardID = core.getInput('cardID');
  const labelName = core.getInput('label');

  try {
    const board = await GloSDK(authToken).boards.get(boardID, { fields: ['labels'] });
    if (!board) {
      core.setFailed(`Board ${boardID} not found`);
      return;
    }
    core.debug(`found board '${board.name}'`);
    core.debug(JSON.stringify(board));

    const card = await GloSDK(authToken).boards.cards.get(boardID, cardID, { fields: ['labels'] });
    if (!card) {
      core.setFailed(`Card ${cardID} not found`);
      return;
    }
    core.debug(`found card '${card.name}'`);
    core.debug(JSON.stringify(card));

    // find label
    if (board.labels) {
      const label = board.labels.find(l => l.name === labelName);
      if (label) {
        core.debug(`found label ${label.name}`);
        if (!card.labels) {
          card.labels = [];
        }
        card.labels.push({
          id: label.id as string,
          name: label.name as string
        });

        // update card
        await GloSDK(authToken).boards.cards.edit(boardID, cardID, card);
        core.debug(`label '${label}' added to card`);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
