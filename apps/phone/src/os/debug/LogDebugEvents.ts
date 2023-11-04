import config from '../../config/default.json';

interface DebugEvent {
  action?: string;
  level?: number;
  data: any;
}

/**
 * Send an event and debug content for the logger according to the config values found in the
 * `config/default.json`. Lower log level means more verbose logs.
 *
 * @param event A debug log object
 * @param event.name The name of the event to log
 * @param event.level The level of this debug log (1-5 ideally)
 * @param event.content The content of whatever
 **/

function LogDebugEvent(event: DebugEvent) {
  const logLevel = event.level || 1;
  const name = event.action || 'Undefined action';

  if (import.meta.env.DEV && config.debug.printDebugLogs && logLevel >= config.debug.logLevel) {
    console.group(`${name} | Level: ${logLevel}`);
    console.dir(event.data);
    console.groupEnd();
  }
}

export default LogDebugEvent;
