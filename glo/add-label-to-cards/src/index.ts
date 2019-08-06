import * as core from '@actions/core';
import GloSDK from '@axosoft/glo-sdk';

interface IBoard {
  id: string;
  cards: string[];
}

async function run() {
  const authToken = core.getInput('authToken');
  const boardsJson = core.getInput('boards');
  const labelName = core.getInput('label');

  try {
    const boardIds = JSON.parse(boardsJson);
    if (!boardIds) {
      return;
    }


    for (let i=0; i < boardIds.length; i++) {
      const boardData = boardIds[i] as IBoard;
      const boardID = boardData.id;
      const cardIDs = boardData.cards;

      // find the board { id, labels }
      const board = await GloSDK(authToken).boards.get(boardID, { fields: ['labels'] });
      if (!board) {
        core.setFailed(`Board ${boardID} not found`);
        continue;
      }

      for (let j=0; j < cardIDs.length; j++){
        const cardID = cardIDs[j];

        // find the card { id, labels }
        const card = await GloSDK(authToken).boards.cards.get(boardID, cardID, { fields: ['labels'] });
        if (!card) {
          core.setFailed(`Card ${cardID} not found`);
          continue;
        }

        // find label
        if (board.labels) {
          const label = board.labels.find(l => l.name === labelName);
          if (label) {
            if (!card.labels) {
              card.labels = [];
            }

            // add label to the card
            card.labels.push({
              id: label.id as string,
              name: label.name as string
            });

            // update card
            await GloSDK(authToken).boards.cards.edit(boardID, cardID, card);
          }
        }
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
