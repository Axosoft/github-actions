"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
function formatResponse(response) {
    return core.setOutput("cardIds", JSON.stringify(response));
    ;
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        core.debug(process.env.GITHUB_EVENT_NAME || '');
        if (process.env.GITHUB_EVENT_NAME !== 'push') {
            return formatResponse([]);
        }
        const event = fs.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' });
        core.debug(JSON.stringify(event));
        if (!event || !event.head_commit || !event.head_commit.message) {
            return formatResponse([]);
        }
        let bodyToSearchForGloLink = event.head_commit.message;
        core.debug(bodyToSearchForGloLink);
        const urlREGEX = RegExp(`https://app.gitkraken.com/glo/board/([\\w.-]+)/card/([\\w.-]+)`, 'g');
        let boardIdIndexMap = {};
        let boards = [];
        let foundResult;
        while ((foundResult = urlREGEX.exec(bodyToSearchForGloLink)) !== null) {
            // 0 https://app.gitkraken.com/glo/board/WypkcIjPCxAArrhR/card/XKTgt5arBgAPsVjF
            const boardId = foundResult[1];
            const cardId = foundResult[2];
            core.debug(JSON.stringify(foundResult));
            if (!foundResult || foundResult.length < 3) {
                // link is not valid??
                return;
            }
            boardIdIndexMap[boardId] = boardIdIndexMap[boardId] || boards.length;
            const board = boards[boardIdIndexMap[boardId]];
            if (board) {
                board.cardIds.push(cardId);
            }
            else {
                boards[boardIdIndexMap[boardId]] = {
                    id: boardId,
                    cardIds: [cardId]
                };
            }
        }
        core.debug(JSON.stringify(boards));
        return formatResponse(boards);
    });
}
run();