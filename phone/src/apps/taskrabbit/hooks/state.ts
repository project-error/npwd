import { atom, useRecoilValue } from 'recoil';
import { TaskRabbitJobs } from '@typings/taskrabbit';

const jobData: TaskRabbitJobs[] = [
  {
    id: 0,
    title: 'Fishing 🎣',
    description:
      'Are you the next greatest bass fisherman of DreamState? Well why not try your luck at fishing, there is different types to fish out there with more rewards to have.',
    stars: 2,
    blip_location: [9.4722, 879.6013],
  },
  {
    id: 1,
    title: 'Gold Panning 🥇',
    description:
      'Ever wanted to feel like a roman? Pan the river of Sandy Shores to discover gold and other exciting materials that can make your day richer!',
    stars: 2,
    blip_location: [-181.6339, 3039.8123],
  },
  {
    id: 2,
    title: 'Mining ⛏',
    description:
      'Mine to your hearts content, get numerous materials which can be sold to various people you have gunpowder people will buy it off you just make an ad or use it to stock up on your own armory!',
    stars: 3,
    blip_location: [2829.3926, 2800.6096],
  },
  {
    id: 3,
    title: 'Garbage Runs 🗑',
    description:
      'Clean the streets of DreamState in exchange for some cold hard cash and materials that no-one is gonna notice is gone since its all rubbish right?',
    stars: 3,
    blip_location: [-321.5192, -1546.7036],
  },
  {
    id: 4,
    title: 'Salvaging 👙',
    description:
      "There is so much treasure out there to find in the seas but be careful you're not the only one after the treasure, people will pay a pretty penny or stock up for the next apocalypse who knows!",
    stars: 4,
    blip_location: [-2079.8958, 2601.3701],
  },
  {
    id: 5,
    title: 'Hunting 🦌',
    description:
      "Come on down to the ranch and get your tasks today the more you hunt the better you'll be rewarded. Restaurants will also buy your wares for some extra cash!",
    stars: 4,
    blip_location: [1219.3966, 1846.7964],
  },
  {
    id: 6,
    title: 'Apply For EMS 🚑',
    description:
      'Want to be a part of the driving force of the city? Apply today in discordia which also comes along with great benefits + top notch salary!',
    stars: 5,
    blip_location: [292.5802, -574.1563],
  },
];

export const taskRabbitState = {
  tasks: atom<TaskRabbitJobs[] | null>({
    key: 'taskRabbitState',
    default: jobData,
  }),
};

export function grabRabbitTaskById(taskId: number): TaskRabbitJobs {
  // @edge-case In the case of weird taskId it sends index 0.
  if (taskId >= jobData.length || taskId < 0) return jobData[0];
  return jobData[taskId];
}

export const useTaskRabbitListings = () => useRecoilValue(taskRabbitState.tasks);
