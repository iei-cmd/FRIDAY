import { google } from 'googleapis';
import { Readable } from 'stream';

// Environment variables for Google Drive OAuth
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/drive/callback';

export interface DriveTokenStorage {
  access_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
  expiry_date: number;
  admin_email: string;
  admin_name?: string;
  parent_folder_id?: string;
  root_folder_id?: string;
}

export function isGoogleDriveConfigured(): boolean {
  return Boolean(GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET);
}

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );
}

export function getDriveAuthUrl(): string {
  const oauth2Client = createOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ];

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
  });
}

export async function exchangeCodeForTokens(code: string) {
  const oauth2Client = createOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Fetch admin profile
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data: userInfo } = await oauth2.userinfo.get();

  return {
    tokens,
    userInfo,
  };
}

export function getAuthenticatedDriveClient(tokens: {
  access_token: string;
  refresh_token?: string;
}) {
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Searches for a folder by name inside a parent folder.
 */
export async function findFolder(
  drive: ReturnType<typeof google.drive>,
  folderName: string,
  parentId?: string
): Promise<string | null> {
  let query = `name = '${folderName.replace(/'/g, "\\'")}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`;
  if (parentId) {
    query += ` and '${parentId}' in parents`;
  }

  const res = await drive.files.list({
    q: query,
    fields: 'files(id, name, webViewLink)',
    spaces: 'drive',
  });

  if (res.data.files && res.data.files.length > 0) {
    return res.data.files[0].id || null;
  }
  return null;
}

/**
 * Creates a folder inside a parent folder.
 */
export async function createFolder(
  drive: ReturnType<typeof google.drive>,
  folderName: string,
  parentId?: string
): Promise<{ id: string; webViewLink?: string }> {
  const fileMetadata: any = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentId) {
    fileMetadata.parents = [parentId];
  }

  const res = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, webViewLink',
  });

  return {
    id: res.data.id!,
    webViewLink: res.data.webViewLink || undefined,
  };
}

/**
 * Ensures the Root "IEI Data of Works" folder exists in the Admin's Drive.
 */
export async function ensureRootFolder(
  drive: ReturnType<typeof google.drive>,
  parentFolderId?: string
): Promise<{ id: string; webViewLink: string }> {
  const rootFolderName = 'IEI Data of Works';
  const existingId = await findFolder(drive, rootFolderName, parentFolderId);

  if (existingId) {
    const file = await drive.files.get({
      fileId: existingId,
      fields: 'id, name, webViewLink',
    });
    return {
      id: existingId,
      webViewLink: file.data.webViewLink || `https://drive.google.com/drive/folders/${existingId}`,
    };
  }

  const created = await createFolder(drive, rootFolderName, parentFolderId);
  return {
    id: created.id,
    webViewLink: created.webViewLink || `https://drive.google.com/drive/folders/${created.id}`,
  };
}

/**
 * Creates member folder hierarchy:
 * IEI Data of Works / [Member Full Name] / {Work Reports, Supporting Documents, Monthly Reports}
 */
export async function ensureMemberFolders(
  drive: ReturnType<typeof google.drive>,
  rootFolderId: string,
  memberName: string
): Promise<{
  memberFolderId: string;
  memberFolderUrl: string;
  workReportsFolderId: string;
  supportingDocsFolderId: string;
  monthlyReportsFolderId: string;
}> {
  // 1. Member Folder
  let memberFolderId = await findFolder(drive, memberName, rootFolderId);
  let memberFolderUrl = '';

  if (!memberFolderId) {
    const createdMember = await createFolder(drive, memberName, rootFolderId);
    memberFolderId = createdMember.id;
    memberFolderUrl = createdMember.webViewLink || `https://drive.google.com/drive/folders/${memberFolderId}`;
  } else {
    memberFolderUrl = `https://drive.google.com/drive/folders/${memberFolderId}`;
  }

  // 2. Subfolders
  const subfolders = ['Work Reports', 'Supporting Documents', 'Monthly Reports'];
  const folderIds: Record<string, string> = {};

  for (const sub of subfolders) {
    let subId = await findFolder(drive, sub, memberFolderId);
    if (!subId) {
      const createdSub = await createFolder(drive, sub, memberFolderId);
      subId = createdSub.id;
    }
    folderIds[sub] = subId;
  }

  return {
    memberFolderId,
    memberFolderUrl,
    workReportsFolderId: folderIds['Work Reports'],
    supportingDocsFolderId: folderIds['Supporting Documents'],
    monthlyReportsFolderId: folderIds['Monthly Reports'],
  };
}

/**
 * Uploads a file buffer or stream into a specific Drive folder.
 */
export async function uploadBufferToDrive(
  drive: ReturnType<typeof google.drive>,
  buffer: Buffer,
  fileName: string,
  mimeType: string,
  parentFolderId: string
): Promise<{
  fileId: string;
  webViewLink: string;
  webContentLink?: string;
}> {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  const fileMetadata = {
    name: fileName,
    parents: [parentFolderId],
  };

  const media = {
    mimeType: mimeType || 'application/octet-stream',
    body: stream,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, webViewLink, webContentLink',
  });

  return {
    fileId: response.data.id!,
    webViewLink: response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`,
    webContentLink: response.data.webContentLink || undefined,
  };
}
