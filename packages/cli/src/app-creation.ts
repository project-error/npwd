import { simpleGit } from 'simple-git';

type CreateApp = {
	name: string;
	template: 'react' | 'vue' | 'svelte';
};

const gitRepos = Object.freeze({
	react: 'https://github.com/project-error/npwd-app-template',
	vue: '',
	svelte: '',
});

export const createApp = (args: CreateApp) => {
	simpleGit().clone(gitRepos[args.template]);
};
