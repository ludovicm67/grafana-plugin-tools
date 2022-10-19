import path from 'path';

import minimist from 'minimist';
import { assertRootUrlIsValid } from '../utils/pluginValidation';
import { buildManifest, signManifest, saveManifest } from '../utils/manifest';

export const sign = async (argv: minimist.ParsedArgs) => {
  const pluginDistDir = path.resolve('dist');
  const signatureType = argv.signatureType;
  const rootUrls = argv.rootUrls.split(',');

  try {
    console.log('Building manifest...');
    const manifest = await buildManifest(pluginDistDir);

    console.log('Signing manifest...');
    if (signatureType) {
      manifest.signatureType = signatureType;
    }
    if (rootUrls && rootUrls.length > 0) {
      rootUrls.forEach(assertRootUrlIsValid);
      manifest.rootUrls = rootUrls;
    }

    manifest.toolkit = { version: '' };
    const signedManifest = await signManifest(manifest);

    console.log('Saving signed manifest...');
    await saveManifest(pluginDistDir, signedManifest);

    console.log('Signed successfully');
  } catch (err) {
    console.warn(err);
  }
};