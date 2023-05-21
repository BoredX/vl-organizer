import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import playerPropType from './playerPropType';
import { indexToPartyLetter } from '../utils/generator';

const CopyRow = ({
  partyArray,
  partyOrderArray,
  bonusArray,
  getShadParty,
  getNxList,
}) => {
  const handlePartyCopy = () => {
    if (partyArray.length > 0) {
      const str = copyPartyInfo(partyArray, partyOrderArray, getShadParty);
      navigator.clipboard.writeText(str);
    }
  };

  const handleNXCopy = () => {
    const nx = getNxList();
    if (nx.length > 0) {
      let str = `NX: ${orderString(nx)}`;
      str = str.replace('\n\n', '');
      navigator.clipboard.writeText(str);
    }
  };

  const handleBonusCopyDiscord = () => {
    if (bonusArray) {
      const str = copyBonusDiscord(bonusArray);
      navigator.clipboard.writeText(str);
    }
  };

  const handleBonusCopyInGame = (bonus) => {
    if (bonus) {
      let str = copyBonusInGame(bonus);
      if (str.length > 70) {
        const numLooters = str.split('|').length;
        let separatorIndex = 0;
        for (let i = 0; i < Math.floor(numLooters / 2); i += 1) {
          separatorIndex = str.indexOf('|', separatorIndex + 1);
        }
        const lineOne = str.substring(0, separatorIndex - 1);
        const lineTwo = str.substring(separatorIndex + 2);
        str = `${lineOne}\n${lineTwo}`;
      }
      navigator.clipboard.writeText(str);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="center"
      columnGap={10}
    >
      <Button variant="contained" color="info" onClick={handlePartyCopy}>
        Copy party info
      </Button>
      <Button variant="contained" color="info" onClick={handleNXCopy}>
        Copy NX
      </Button>
      <Button variant="contained" color="info" onClick={handleBonusCopyDiscord}>
        Copy bonus (Discord)
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => handleBonusCopyInGame(bonusArray[0])}
      >
        Copy bonus A
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => handleBonusCopyInGame(bonusArray[1])}
      >
        Copy bonus B
      </Button>
      <Button
        variant="contained"
        color="info"
        onClick={() => handleBonusCopyInGame(bonusArray[2])}
      >
        Copy bonus C
      </Button>
    </Box>
  );
};

CopyRow.propTypes = {
  partyArray: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(playerPropType))
  ),
  partyOrderArray: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.shape(playerPropType))
  ),
  bonusArray: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        boxes: PropTypes.string,
        name: PropTypes.string,
      })
    )
  ),
  getShadParty: PropTypes.func,
  getNxList: PropTypes.func,
};

const copyPartyInfo = (parties, partyOrder, getShadParty) => {
  let result = '';
  parties.forEach((party, i) => {
    const igns = party.map((p) => p.names[p.chosenIndex]);

    if (party.length > 1) {
      const ldr = ` - **Leader**: ${igns[0]}`;
      const jr = party.length > 2 ? ` - **Jr**: ${igns[1]}` : '';
      result += `**Team ${indexToPartyLetter(i)}**${ldr}${jr}\n`;
      result += `/partyinvite ${igns.join(' ')}\n\n`;
    }
  });
  if (partyOrder[0].length > 0) {
    const firstBs = partyOrder[0][0];
    const firstBsName = firstBs.names[firstBs.chosenIndex];
    result += `**Bishop Party** - **Leader**: ${firstBsName}\n`;
    result += copyBsParty(partyOrder);
  }

  result += `**Res Order**\n`;
  result += orderString(partyOrder[0]);
  result += `**TL Order**\n`;
  result += orderString(partyOrder[1]);
  result += `**Smoke Order**\n`;
  result += orderString(getShadParty());
  result += '**Belts**\n';
  const lastString = orderString(partyOrder[3]);
  result += lastString.replace('\n\n', '');
  return result;
};

const orderString = (party) =>
  `${party.map((p) => `${p.names[p.chosenIndex]}`).join(', ')}\n\n`;

export const copyBonusDiscord = (bonusArray) => {
  const numLooters = bonusArray.reduce((acc, b) => acc + b.length, 0);
  if (numLooters >= 12) {
    return bonusArray
      .map((bonus) =>
        bonus.map((b) => `${b.boxes.padEnd(7, ' ') + b.name}`).join('\n')
      )
      .join('\n');
  }
  return bonusArray
    .map((bonus) => bonus.map((b) => `${`${b.boxes} ${b.name}`}`).join('\n'))
    .join('\n');
};

export const copyBonusInGame = (bonus) =>
  bonus.map((b) => `${`${b.boxes} ${b.name}`}`).join(' | ');

const copyBsParty = (partyOrder) => {
  let bses = partyOrder[0]
    .map((p) => p.names[p.chosenIndex])
    .slice(1)
    .join(' ');

  const buccs = partyOrder[1].map((p) => p.names[p.chosenIndex]).join(' ');
  if (bses !== '') {
    bses += ' ';
  }
  const testStr = `/partyinvite ${bses}${buccs}`;
  let result = '';
  if (testStr.length > 70) {
    const limitedString = testStr.substring(0, 70);
    const idx = limitedString.lastIndexOf(' ');
    result += `${testStr.substring(0, idx)}\n`;
    result += `/partyinvite${testStr.substring(idx)}\n\n`;
  } else {
    result = `${testStr}\n\n`;
  }
  return result;
};

export default CopyRow;
