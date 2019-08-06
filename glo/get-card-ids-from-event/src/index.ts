import * as fs from 'fs';
import * as core from '@actions/core';

interface IBoard {
  id: string;
  cardIds: string[];
}
function formatResponse(response: IBoard[]) {
  return core.setOutput("cardIds", JSON.stringify(response));;
}

async function run() {
  console.log(process.env.GITHUB_EVENT_NAME || 'test123');

  if (process.env.GITHUB_EVENT_NAME !== 'push') {
    return formatResponse([]);
  }
  const event: any = fs.readFileSync(process.env.GITHUB_EVENT_PATH as string, { encoding: 'utf8' });

  console.log(JSON.stringify(event));
  if (!event || !event.head_commit || !event.head_commit.message) {
    return formatResponse([]); 
  }

  let bodyToSearchForGloLink = event.head_commit.message;

  console.log(bodyToSearchForGloLink);
  const urlREGEX = RegExp(`https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`, 'g');

  let boardIdIndexMap: { [boardId: string]: number } = {};
  let boards: IBoard[] = [];
  let foundResult;
  while ((foundResult = urlREGEX.exec(bodyToSearchForGloLink)) !== null) {
    // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
    const boardId = foundResult[1];
    const cardId = foundResult[2];

    console.log(JSON.stringify(foundResult));
    if (!foundResult || foundResult.length < 3) {
      // link is not valid??
      return;
    }

    boardIdIndexMap[boardId] = boardIdIndexMap[boardId] || boards.length;

    const board = boards[boardIdIndexMap[boardId]];
    if (board) {
      board.cardIds.push(cardId);
    } else {
      boards[boardIdIndexMap[boardId]] = {
        id: boardId,
        cardIds: [cardId]
      }
    }
  }

  console.log(JSON.stringify(boards));
  return formatResponse(boards);
}

console.log('life')
console.log('ahhh');
run();
