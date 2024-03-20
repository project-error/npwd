import { ContactEvents } from '@typings/contact';
import { RegisterNuiProxy } from './cl_utils';

const QBCore = global.exports['qb-core'].GetCoreObject();
const npwdExports = global.exports['npwd'];

type Vector = {
    x: number;
    y: number;
    z: number;
  };

RegisterNuiProxy(ContactEvents.PAY_CONTACT);
RegisterNuiProxy(ContactEvents.GET_CONTACTS);
RegisterNuiProxy(ContactEvents.ADD_CONTACT);
RegisterNuiProxy(ContactEvents.DELETE_CONTACT);
RegisterNuiProxy(ContactEvents.UPDATE_CONTACT);

const getVector = (coords: number[]) => {
    const [x, y, z] = coords;
    return {
        x,
        y,
        z,
    };
}

const getDistance = (v1: Vector, v2: Vector) => {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    const dz = v1.z - v2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const GetClosestPlayer = () => {
    const closestPlayers = QBCore.Functions.GetPlayersFromCoords()
    let closestDistance = -1
    let closestPlayer = -1
    const coords = GetEntityCoords(PlayerPedId(), true)

    for (let i = 0; i < closestPlayers.length; i++) {
        if (closestPlayers[i] !== PlayerId()) {
            const pos = GetEntityCoords(GetPlayerPed(closestPlayers[i]), true)
            const distance = getDistance(getVector(pos), getVector(coords))

            if (closestDistance === -1 || closestDistance > distance) {
                closestPlayer = closestPlayers[i]
                closestDistance = distance
            }
        }
    }

    return [closestPlayer, closestDistance]
}
    
on(ContactEvents.GIVE_CONTACT_DETAILS, () => {
    const [player, distance] = GetClosestPlayer()

    if (player !== -1 && distance < 2.5) {
        const PlayerId = GetPlayerServerId(player)
        emitNet(ContactEvents.GIVE_CONTACT_DETAILS, PlayerId)
    } else {
        QBCore.Functions.Notify("No one nearby!", "error")
    }
});

// Opens the phone on the new contacts page with the number and name prefilled out
onNet(ContactEvents.RECEIVE_CONTACT_DETAILS, (sendingPlayerNumber: string, sendingPlayerName: string) => {
    npwdExports.setPhoneVisible(true);

    npwdExports.fillNewContact({ name: sendingPlayerName, number: sendingPlayerNumber })
});
