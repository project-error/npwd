import React, {useEffect, useState} from 'react';

import {useTranslation} from 'react-i18next';

import {useDebounce} from '@os/phone/hooks/useDebounce';
import {useSetContactFilterInput} from '../../hooks/state';
import { Input } from '@npwd/keyos';
import { Search } from 'lucide-react';
import { contactsSurfaces } from '../ui/contacts-surfaces';
import { cn } from '@utils/css';

export const SearchContacts: React.FC = () => {
    const [t] = useTranslation();
    const setFilterVal = useSetContactFilterInput();
    const [inputVal, setInputVal] = useState('');

    const debouncedVal = useDebounce<string>(inputVal, 500);

    useEffect(() => {
        setFilterVal(debouncedVal);
    }, [debouncedVal, setFilterVal]);

    return (
        <div className="relative">
            <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-keyos-muted"/>
                <Input
                    className={cn(contactsSurfaces.input, 'pl-10')}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
                    value={inputVal}
                />
            </div>
        </div>
    );
};
