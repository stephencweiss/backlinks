import { FileData } from 'nonplain';

export function cleanBacklinks(file: FileData) {
  return file.metadata?.backlinks?.map(cleanBacklink) ?? [];
}

export const MISSING_FIELD_ERROR = 'Required fields are missing';
export function cleanBacklink(backlink: any) {
  const { file, title } = backlink;
  if (!file || !title) {
    // These are likely the only two fields that are required to make a useful link.
    throw new Error(MISSING_FIELD_ERROR);
  }
  return { file, title };
}

export function addBacklinksToOriginal(originalFile: FileData, backlinks: any) {
  return { ...originalFile, metadata: { ...originalFile.metadata, backlinks } };
}
