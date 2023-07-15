import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useDebounce } from '@os/phone/hooks/useDebounce';
import { useSetContactFilterInput } from '../../hooks/state';
import { NPWDSearchInput } from "@ui/components";

export const SearchContacts: React.FC = () => {
	const [t] = useTranslation();
	const setFilterVal = useSetContactFilterInput();
	const [inputVal, setInputVal] = useState('');
	
	const debouncedVal = useDebounce<string>(inputVal, 500);
	
	useEffect(() => {
		setFilterVal(debouncedVal);
	}, [debouncedVal, setFilterVal]);
	
	return (
		<div className="w-full py-2 px-4">
			<NPWDSearchInput
				onChange={(e) => setInputVal(e.target.value)}
				placeholder={t('CONTACTS.PLACEHOLDER_SEARCH_CONTACTS')}
				value={inputVal}
			/>
		</div>
	);
};
