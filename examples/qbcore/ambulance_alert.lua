local QBCore = exports["qb-core"]:GetCoreObject()

RegisterNetEvent("hospital:server:ambulanceAlert", function(text)
	local src = source
	local ped = GetPlayerPed(src)
	local coords = GetEntityCoords(ped)
	local players = QBCore.Functions.GetQBPlayers()
	for _, v in pairs(players) do
		if v.PlayerData.job.name == "ambulance" and v.PlayerData.job.onduty then
			exports.npwd:emitMessage({
				senderNumber = "911",
				targetNumber = v.PlayerData.charinfo.phone,
				message = "Person is dead.",
				embed = {
					type = "location",
					coords = { coords.x, coords.y, coords.z },
					phoneNumber = "911",
				},
			})
		end
	end
end)
