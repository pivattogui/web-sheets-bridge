import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { eventErrorHandler, getQuestionsWithFields } from './util';
import { getGoogleSheet } from './googlesheets';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'
import { baseLogger } from './logger';
import { retry } from './retry';

const logger = baseLogger.child({ service: "webhook" }, { level: "debug" })

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
        logger.debug({ event }, 'Received event');

        const error = eventErrorHandler(event);

        if (!!error) {
            logger.error({ error }, 'Error in event');
            return error;
        }

        const payload: any = JSON.parse(event.body || '{}');
        const docId = event.headers['doc_id'] as string

        logger.debug({ payload, docId }, 'Received payload');

        const questionsWithFields = getQuestionsWithFields(payload)

        const doc = await getGoogleSheet(docId)

        await doc.loadInfo()

        logger.debug({ doc }, 'Loaded doc');

        const sheetTitle = event.headers['sheet']

        let sheet = !!sheetTitle ? doc.sheetsByTitle[sheetTitle] : doc.sheetsByIndex[0]

        if (!sheet) sheet = doc.sheetsByIndex[0]

        await sheet.loadHeaderRow()

        logger.debug({ sheet }, 'Loaded sheet');

        const headerValues = sheet.headerValues

        logger.debug({ headerValues }, 'Loaded headerValues');

        const rows: any[] = []
        for (const question of questionsWithFields) {
            const row = headerValues.reduce((acc, header) => {
                acc[header] = question[header] ?? getDefaultValues(header)

                return acc
            }, {} as Record<string, string>)

            rows.push(row)
        }

        await retry(() => sheet.addRows(rows), 10, 5000)

        logger.debug({ rows }, 'Added row');

        logger.debug('Success');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Success'
            }),
        };
    } catch (error) {
        logger.error({ error }, 'Error');
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: error
            }),
        };

    }
};

const getDefaultValues = (header: string) => {
    switch (header) {
        case 'id':
            return uuidv4()
        case 'data':
            return moment().format('DD/MM/YYYY')
        case 'data_hora':
            return moment().format('DD/MM/YYYY HH:mm:ss')
        default:
            return '-'
    }
}
