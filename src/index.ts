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

  console.log(`Processing ${files.collect().length} files.`);
  backlinker(files);

  files.collect().forEach((file: FileData) => {
    const { dir, base } = file.metadata?.file;
    const backlinks = cleanBacklinks(file);

    const resolvedFilePath = path.resolve(dir, base);
    const originalFile = new File().load(resolvedFilePath);

    const modifiedFile = originalFile.transform((ogFile: FileData) =>
      addBacklinksToOriginal(ogFile, backlinks)
    );

    if (preview) {
      console.log(`preview of ${file.metadata.title}`);
      console.log(JSON.stringify(modifiedFile, null, 4));
    } else {
      modifiedFile.write(resolvedFilePath);
    }
  });
  console.log(`Done processing files.`)
}
