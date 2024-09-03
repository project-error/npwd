import React, { useEffect } from "react";

import { useRecoilSnapshot } from "recoil";
import defaultConfig from "./../config/default.json";

interface RecoilDebugObserverProps {
	children: React.ReactNode;
}

export const RecoilDebugObserver: React.FC<RecoilDebugObserverProps> = ({
	children,
}) => {
	const snapshot = useRecoilSnapshot();

	useEffect(() => {
		// Enable debugging atom mutation if needed
		if (!defaultConfig.debug.shouldShowAtomDebug) return;

		console.debug("The following atoms were modified:");
		for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
			console.debug(node.key, snapshot.getLoadable(node));
		}
	}, [snapshot]);

	return <>{children}</>;
};
