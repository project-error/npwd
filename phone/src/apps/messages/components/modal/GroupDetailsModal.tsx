import React, { useState } from 'react';
import {
  Avatar as MuiAvatar,
  Button,
  Paper,
  Slide,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import { findParticipants } from '../../utils/helpers';
import { useMyPhoneNumber } from '@os/simcard/hooks/useMyPhoneNumber';
import { useContactActions } from '../../../contacts/hooks/useContactActions';
import makeStyles from '@mui/styles/makeStyles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MessageConversation } from '@typings/messages';
import { SearchField } from '@ui/components/SearchField';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import GroupMemberInfo from './GroupMemberInfo';
import AddParticipantModal from './AddParticipantModal';
import Backdrop from '@ui/components/Backdrop';
import { useMessageAPI } from '../../hooks/useMessageAPI';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 20,
    height: '100%',
    width: '100%',
    position: 'absolute',
    background: theme.palette.background.default,
  },
  groupDetails: {
    width: '75%',
    margin: '0 auto',
    textAlign: 'center',
    marginBottom: 15,
  },
  participantList: {
    margin: '0 auto',
    textAlign: 'center',
  },
  buttons: {
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    gap: 5,
    marginTop: 5,
  },
  avatar: {
    margin: 'auto',
    height: '100px',
    width: '100px',
    marginBottom: 10,
  },
}));

interface GroupDetailsModalProps {
  open: boolean;
  onClose: () => void;
  conversation: MessageConversation;
  removeMember: (number: string) => void;
  leaveGroup: () => void;
  addContact: (number: string) => void;
  makeOwner: (number: string) => void;
}

const GroupDetailsModal: React.FC<GroupDetailsModalProps> = ({
  open,
  onClose,
  conversation,
  leaveGroup,
  removeMember,
  addContact,
  makeOwner,
}) => {
  const classes = useStyles();

  const groupAmount = conversation.conversationList.split('+').length;
  const myPhoneNumber = useMyPhoneNumber();
  const { getContactByNumber } = useContactActions();
  const { addGroupMembers } = useMessageAPI();
  const [inputVal, setInputVal] = useState('');

  const [participants, setParticipants] = useState(
    findParticipants(conversation.conversationList, myPhoneNumber),
  );

  const updateSearch = (e: string) => {
    setInputVal(e);
    setFilterVal(e);
  };

  const setFilterVal = (filterValue: string) => {
    if (!filterValue)
      return setParticipants(findParticipants(conversation.conversationList, myPhoneNumber));
    const searchRegex = new RegExp(filterValue, 'gi');
    const filteredParticipants = participants.filter((participant) => {
      const contact = getContactByNumber(participant);
      return participant.match(searchRegex) || contact?.display.match(searchRegex);
    });
    setParticipants(filteredParticipants);
  };

  const removeGroupMember = (number: string) => {
    removeMember(number);
    setParticipants(participants.filter((participant) => participant !== number));
  };

  const handleAddGroupMembers = (selectedParticipants: string[]) => {
    setParticipants([...participants, ...selectedParticipants]);
    addGroupMembers(
      conversation.id,
      selectedParticipants,
      myPhoneNumber,
      conversation.conversationList,
    );
  };

  const closeGroupSettings = () => {
    setInputVal(null);
    setSelectedMember('');
    setIsOptionsModalOpen(false);
    onClose();
  };

  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);

  const [selectedMember, setSelectedMember] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const selectMember = (member: string) => {
    setSelectedMember(member);
    setIsOptionsModalOpen(true);
  };

  const closeOptionsModal = () => {
    setIsOptionsModalOpen(false);
  };

  const isGroupOwner = conversation.owner === myPhoneNumber;

  return (
    <Slide direction="left" in={open}>
      <Paper className={classes.root} square>
        <AddParticipantModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(!isAddModalOpen)}
          participants={participants}
          myPhoneNumber={myPhoneNumber}
          handleAddGroupMembers={handleAddGroupMembers}
        />
        {isAddModalOpen && <Backdrop />}
        <GroupMemberInfo
          open={isOptionsModalOpen}
          onClose={closeOptionsModal}
          participant={selectedMember}
          removeMember={removeGroupMember}
          addContact={addContact}
          conversation={conversation}
          makeOwner={makeOwner}
        />

        <Button style={{ margin: 10 }} onClick={closeGroupSettings}>
          <ArrowBackIcon fontSize="large" />
        </Button>
        <div className={classes.groupDetails}>
          <MuiAvatar className={classes.avatar} src={conversation.avatar} />
          <Typography variant="h6">{conversation.label}</Typography>
          <Typography fontSize={'14px'} color={'#8d8d93'}>
            Group · {groupAmount} Members
          </Typography>
        </div>
        <SearchField
          value={inputVal}
          onChange={(e) => updateSearch(e.target.value)}
          placeholder={'Search..'}
        />
        <div className={classes.participantList}>
          <List>
            {!inputVal && (
              <ListItem divider>
                <ListItemAvatar>
                  <MuiAvatar />
                </ListItemAvatar>
                <ListItemText
                  primary={'You'}
                  primaryTypographyProps={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                />
              </ListItem>
            )}
            {participants.map((participant) => {
              const contact = getContactByNumber(participant);
              return (
                <ListItem key={participant} divider>
                  <ListItemAvatar>
                    {contact?.avatar ? (
                      <MuiAvatar src={contact.avatar} />
                    ) : (
                      <MuiAvatar>{contact?.display.slice(0, 1).toUpperCase()}</MuiAvatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={contact?.display ?? participant}
                    primaryTypographyProps={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />

                  <Button
                    style={{ margin: -15 }}
                    onClick={() => selectMember(participant)}
                    disabled={isOptionsModalOpen}
                  >
                    <MoreVertIcon />
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </div>
        <div className={classes.buttons}>
          {isGroupOwner && (
            <Button
              size="medium"
              variant="outlined"
              disabled={isOptionsModalOpen}
              onClick={() => setIsAddModalOpen(!isAddModalOpen)}
            >
              Add Participant
            </Button>
          )}
          <Button
            size="medium"
            variant="outlined"
            color="error"
            onClick={leaveGroup}
            disabled={isOptionsModalOpen}
          >
            Leave Group
          </Button>
        </div>
      </Paper>
    </Slide>
  );
};

export default GroupDetailsModal;
