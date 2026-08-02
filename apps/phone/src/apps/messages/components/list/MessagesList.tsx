import React, {useEffect, useState} from 'react';
import {MessageConversation} from '@typings/messages';
import useMessages from '../../hooks/useMessages';
import MessageGroupItem from './MessageGroupItem';
import {useTranslation} from 'react-i18next';
import {
    useCheckedConversations,
    useFilteredConversationsValue,
    useIsEditing,
    useSetFilterValue,
} from '../../hooks/state';
import {useDebounce} from '@os/phone/hooks/useDebounce';
import {useMessageAPI} from '../../hooks/useMessageAPI';
import {Pencil, Search, X} from "lucide-react";
import { Button, Input, List } from '@npwd/keyos';

const MessagesList = (): any => {
    const [isEditing, setIsEditing] = useIsEditing();
    const [checkedConversation, setCheckedConversation] = useCheckedConversations();

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

    if (!conversations) return <p className="p-4 text-keyos-muted">No messages</p>;

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
         <div className="flex h-full min-h-0 flex-col">
            {!!conversations.length && (
                <Button
                    className="absolute right-3 top-3 z-50 rounded-full"
                    onClick={toggleEdit}
                    size="icon"
                    variant={isEditing ? 'secondary' : 'ghost'}
                >
                    {isEditing ? <X size={18}/> : <Pencil size={18}/>}
                </Button>
            )}

            <div className="w-full border-b border-white/10 px-4 py-3">
                <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-keyos-muted"/>
                    <Input
                        className="border-white/10 bg-keyos-panel pl-10 focus:border-[color:var(--keyos-app-accent)] focus:ring-[color:var(--keyos-app-accent)]/25"
                        onChange={(e) => setInputVal(e.currentTarget.value)}
                        placeholder={t('MESSAGES.SEARCH_PLACEHOLDER')}
                        value={inputVal}
                    />
                </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 pt-4">
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
        </div>
    );
};

export default MessagesList;
