import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import creds from '../credentials.json';

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
];

export const getGoogleSheet = async (docId: string): Promise<GoogleSpreadsheet> => {
    const jwt = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: SCOPES,
    });

    return new GoogleSpreadsheet(docId, jwt);
}
