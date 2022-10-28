import { Command, Option } from 'commander';
const program = new Command();

program.name('NPWD Cli').description('Cli to easily scaffold third party apps');

program
	.command('generate')
	.description('Generate a new third party app in current path')
	.option('-c', '--name', 'Name of the app')
	.addOption(new Option('-t', '--template <template>').choices(['react', 'svelte', 'vue']));

program.parse(process.argv);
