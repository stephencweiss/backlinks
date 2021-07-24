import { Files, File, FileData } from 'nonplain';
import path from 'path';
import { backlinker } from 'nonplain-md-backlinker';
import { addBacklinksToOriginal, cleanBacklinks } from './helpers/helpers';

/**
 * Given a directory of nonplain text files, modifies in place all files with backlinks
 * @param directory - a directory path to the directory of text files
 * @param ext - the extension of the files we're looking for, defaults to md
 */
export function updateBacklinksOnDir(directory: string, ext: string = 'md') {
  const pathToDir = path.resolve(__dirname, directory);
  const files = new Files().load(`${pathToDir}/**/*.${ext}`);
  backlinker(files);

  files.collect().forEach((file: FileData) => {
    const { dir, base } = file.metadata?.file;
    const backlinks = cleanBacklinks(file);

    const resolvedFilePath = path.resolve(dir, base);
    const originalFile = new File().load(resolvedFilePath);

    const modifiedFile = originalFile.transform((ogFile: FileData) =>
      addBacklinksToOriginal(ogFile, backlinks)
    );

    modifiedFile.write(resolvedFilePath);
  });
}
