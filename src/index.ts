import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { PayloadEvent } from './types';
import { eventErrorHandler, getQuestionsWithFields } from './util';
import { getGoogleSheet } from './googlesheets';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid'

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
    const error = eventErrorHandler(event);

    if (error) return error;

    const payload: PayloadEvent = JSON.parse(event.body || '{}');
    const docId = event.headers['doc_id'] as string

    const questionsWithFields = getQuestionsWithFields(payload)

    const doc = await getGoogleSheet(docId)

    await doc.loadInfo()

    const sheet = doc.sheetsByIndex[0];
    await sheet.loadHeaderRow()

    const headerValues = sheet.headerValues

    for (const question of questionsWithFields) {
        const row = headerValues.reduce((acc, header) => {
            acc[header] = question[header] || getDefaultValues(header)


            return acc
        }, {} as Record<string, string>)

        await sheet.addRow(row)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Success'
        }),
    };
};

const getDefaultValues = (header: string) => {
    switch (header) {
        case 'id':
            return uuidv4()
        case 'data':
            return moment().format('DD/MM/YYYY')
        default:
            return '-'
    }
}
