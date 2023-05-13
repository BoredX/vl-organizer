import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material';
import playerPropType from './playerPropType';
import { indexToPartyLetter } from '../utils/generator';

const CopyRow = ({
  partyArray,
  partyOrderArray,
  bonusArray,
  shadParty,
  nxList,
}) => {
  const handlePartyCopy = () => {
    if (partyArray.length > 0) {
      const str = copyPartyInfo(partyArray, partyOrderArray, shadParty);
      navigator.clipboard.writeText(str);
    }
  };

  const handleNXCopy = () => {
    const nx = nxList();
    if (nx.length > 0) {
      const str = orderString(nx);
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
      const str = copyBonusInGame(bonus);
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
  shadParty: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
  nxList: PropTypes.arrayOf(PropTypes.shape(playerPropType)),
};

const copyPartyInfo = (parties, partyOrder, shadParty) => {
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

  result += `**Res Order**\n`;
  result += orderString(partyOrder[0]);
  result += `**TL Order**\n`;
  result += orderString(partyOrder[1]);
  result += `**Smoke Order**\n`;
  result += orderString(shadParty());
  result += '**Belts**\n';
  result += orderString(partyOrder[3]);
  return result;
};

const orderString = (party) =>
  `${party.map((p) => `${p.names[p.chosenIndex]}`).join(', ')}\n\n`;

export const copyBonusDiscord = (bonusArray) =>
  bonusArray
    .map((bonus) =>
      bonus.map((b) => `${b.boxes.padEnd(7, ' ') + b.name}`).join('\n')
    )
    .join('\n');

export const copyBonusInGame = (bonus) =>
  bonus.map((b) => `${`${b.boxes} ${b.name}`}`).join(' | ');

export default CopyRow;
