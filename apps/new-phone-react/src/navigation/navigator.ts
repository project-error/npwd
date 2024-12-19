import { Launcher } from "@apps/Launcher";
import { PhoneFrame } from "@native/components/PhoneFrame";
import {  createHashRouter } from "react-router";

export interface AppRoute {
    name: string;
    path: string;
    Component: React.ComponentType;
}

export const createRouter = (navigators: AppRoute[]) => {
    return createHashRouter([{
        path: "/",
        Component: PhoneFrame,
        children: [
            {
                index: true,
                Component: Launcher,
            },
            ...navigators.map(({ path, Component }) => ({
                path,
                Component,
            })),
        ]
    }])
}

