import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';

export const eventErrorHandler = (event: APIGatewayEvent): APIGatewayProxyResult | null => {
    if (event.httpMethod !== 'POST') return {
        statusCode: 405,
        body: JSON.stringify({
            message: 'Method not allowed',
        }),
    };

    if (!event.headers['doc_id']) return {
        statusCode: 400,
        body: JSON.stringify({
            message: 'doc_id is required',
        }),
    };

    return null
}

export const getQuestionsWithFields = (payload: any): any[] => {
    const { perguntas, ...fields } = payload;

    if (!perguntas?.length) return [fields];

    return perguntas.map((question: any) => ({
        ...fields,
        ...question
    }));
};