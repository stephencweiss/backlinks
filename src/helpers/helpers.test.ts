import {
  cleanBacklinks,
  cleanBacklink,
  addBacklinksToOriginal,
  MISSING_FIELD_ERROR,
} from './helpers';
import { FileData } from 'nonplain';

describe('cleanBacklinks', () => {
  it('handles multiple backlinks', () => {});
  it('gracefully handles no backlinks', () => {
    expect(cleanBacklinks({ body: '', metadata: {} })).toEqual([]);
  });
});

describe('cleanBacklink', () => {
  it('will remove extraneous information', () => {
    const backlink = {
      title: 'test',
      file: { key: 'value', path: '/path/to/dire', base: 'file.md' },
    };

    const cleaned = cleanBacklink(backlink);
    expect(cleaned).toStrictEqual(backlink);
  });
  it('will throw an error if required information is missing', () => {
    const missingTitle = {
      file: { key: 'value', path: '/path/to/dire', base: 'file.md' },
    };

    const missingFile = {
      title: 'incomplete',
    };

    expect(() => cleanBacklink(missingTitle)).toThrowError(MISSING_FIELD_ERROR);
    expect(() => cleanBacklink(missingFile)).toThrowError(MISSING_FIELD_ERROR);
  });
});

describe('addBackLinksToOriginal', () => {
  let originalFile: FileData;
  let backlinks: any;
  beforeEach(() => {
    originalFile = { body: '', metadata: {} };
    backlinks = [
      { title: 'test', file: { dir: 'path/to/dir', base: 'file.md' } },
    ];
  });

  it('will add a backlinks object to an original file', () => {
    const modified = addBacklinksToOriginal(originalFile, backlinks);
    expect(modified.metadata.backlinks).toBe(backlinks);
  });
  it('will not modify any other fields on the original file', () => {
    const date = '2020-01-01';
    const file = originalFile;
    file.metadata.date = date;
    const modified = addBacklinksToOriginal(file, backlinks);
    expect(modified.metadata.date).toBe(date);
  });
  it('will overwrite an existing backlinks metadata', () => {
    const newBacklinks = [
      {
        title: 'will replace',
        file: { dir: 'path/to/other/dir', base: 'new.md' },
      },
    ];
    const file = originalFile;
    file.metadata.backlinks = backlinks;
    const modified = addBacklinksToOriginal(originalFile, newBacklinks);
    expect(modified.metadata.backlinks).toBe(newBacklinks);
  });
});
