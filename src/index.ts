import { Files, File, FileData } from 'nonplain';
import path from 'path';
import { backlinker } from 'nonplain-md-backlinker';
import { addBacklinksToOriginal, cleanBacklinks } from './helpers/helpers';

interface updateBacklinksOnDirProps {
  directory: string;
  ext: string;
  preview: boolean;
}

export function updateBacklinksOnDir({
  directory,
  ext = 'md',
  preview = false,
}: updateBacklinksOnDirProps) {
  const pathToDir = path.resolve(directory);
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
