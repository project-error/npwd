import React from 'react';
import MUITextField from '@material-ui/core/TextField';
import MUIInputBase from '@material-ui/core/InputBase';
import { useNuiRequest } from 'fivem-nui-react-lib';
import { PhoneEvents } from '../../../../typings/phone';

const ToggleKeys = ()=>{
	const Nui = useNuiRequest();
	const toggle = React.useCallback((keepGameFocus:boolean)=>{
		Nui.send(PhoneEvents.TOGGLE_KEYS, {
			keepGameFocus,
		});
	}, [Nui])
	return React.useMemo(()=>({toggle}), [toggle])
}

export const TextField = (props) => {
	const KeysHandler = ToggleKeys()
  return(
		<MUITextField
			{...props}
			onFocus={(e)=>{
				KeysHandler.toggle(false)
				if (props.onFocus) {
					props.onFocus(e);
				}
			}}
			onBlur={(e)=>{
				KeysHandler.toggle(true)
				if (props.onBlur) {
					props.onBlur(e);
				}
			}}
		/>
	);
};

export const InputBase = (props) => {
	const KeysHandler = ToggleKeys()
  return (
		<MUIInputBase
	 		{...props}
			onFocus={(e)=>{
				KeysHandler.toggle(false)
				if (props.onFocus) {
					props.onFocus(e);
				}
			}}
			onBlur={(e)=>{
				KeysHandler.toggle(true)
				if (props.onBlur) {
					props.onBlur(e);
				}
			}}
		/>
	 )
};
