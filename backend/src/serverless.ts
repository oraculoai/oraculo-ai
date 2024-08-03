import { bootstrap } from './bootstrap';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

let cachedServer: Handler;

// noinspection JSUnusedGlobalSymbols
export const handler: Handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: Callback,
) => {
  cachedServer = cachedServer ?? (await bootstrap('serverless'));
  return cachedServer(event, context, callback);
};
