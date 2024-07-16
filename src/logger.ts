import { pino } from 'pino'

export const baseLogger = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
})