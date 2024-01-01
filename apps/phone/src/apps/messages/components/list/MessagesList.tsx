import React, {useEffect, useState} from 'react';
import {Box, IconButton} from '@mui/material';
import {MessageConversation} from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import useStyles from './list.styles';
import {SearchField} from '@ui/components/SearchField';
import {useTranslation} from 'react-i18next';
import {
    useCheckedConversations,
    useFilteredConversationsValue,
    useIsEditing,
    useSetFilterValue,
} from '../../hooks/state';
import {useDebounce} from '@os/phone/hooks/useDebounce';
import EditIcon from '@mui/icons-material/Edit';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {Search} from "lucide-react";
import {NPWDInput} from "@ui/components";
import { List } from '@npwd/keyos';

const MessagesList = (): any => {
    const [isEditing, setIsEditing] = useIsEditing();
    const [checkedConversation, setCheckedConversation] = useCheckedConversations();

    const classes = useStyles();
    const [t] = useTranslation();

    const {conversations, goToConversation} = useMessages();

    const {setMessageRead} = useMessageAPI();

    const filteredConversations = useFilteredConversationsValue();
    const setFilterVal = useSetFilterValue();

    const [inputVal, setInputVal] = useState('');

    const debouncedVal = useDebounce<string>(inputVal, 200);

    useEffect(() => {
        setFilterVal(debouncedVal);
    }, [debouncedVal, setFilterVal]);

    if (!conversations) return <p>No messages</p>;

    const handleClick = (conversation: MessageConversation) => () => {
        setMessageRead(conversation.id);
        goToConversation(conversation);
    };

    const toggleEdit = () => {
        setIsEditing((prev) => !prev);
    };

    const handleToggleConversation = (conversationId: number) => {
        const currentIndex = checkedConversation.indexOf(conversationId);
        const newChecked = [...checkedConversation];

        if (currentIndex === -1) {
            newChecked.push(conversationId);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setCheckedConversation(newChecked);
    };

    return (
         <div className="flex flex-col justify-between">
            {!!conversations.length && (
                <Box position="absolute" top={10} right={3}>
                    <IconButton onClick={toggleEdit}>
                        <EditIcon/>
                    </IconButton>
                </Box>
            )}

            <div className="w-full py-2 px-4">
                <div
                    className="flex items-center justify-start bg-neutral-200 dark:bg-neutral-800 rounded-md px-2 space-x-2 border dark:border-neutral-700">
                    <Search className="h-5 w-5 dark:text-neutral-400"/>
                    <NPWDInput
                        className="group-focus:ring-2"
                        onChange={(e) => setInputVal(e.currentTarget.value)}
                        placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
                        value={inputVal}
                    />
                </div>
            </div>

            <Box display="flex" flexDirection="column">
                <div className='px-4'>
                    <List>
                        {[...filteredConversations]
                            .sort((a, b) => {
                                return b.updatedAt - a.updatedAt;
                            })
                            .map((conversation) => (
                                <MessageGroupItem
                                    handleToggle={handleToggleConversation}
                                    isEditing={isEditing}
                                    checked={checkedConversation}
                                    key={conversation.id}
                                    messageConversation={conversation}
                                    handleClick={handleClick}
                                />
                            ))}
                    </List>
                </div>
            </Box>
        </div>
    );
};

export default MessagesList;
