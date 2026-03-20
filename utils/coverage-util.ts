import v8toIstanbul from 'v8-to-istanbul';
import fs from 'fs';
import path from 'path';

interface JSCoverageEntry {
  url: string;
  scriptId: string;
  source?: string;
  functions: Array<{
    functionName: string;
    ranges: Array<{
      startOffset: number;
      endOffset: number;
      count: number;
    }>;
    isBlockCoverage: boolean;
  }>;
}

export async function saveCoverage(coverage: JSCoverageEntry[]) {
  const reportPath = path.join(process.cwd(), 'coverage');
  if (!fs.existsSync(reportPath)) fs.mkdirSync(reportPath);

  for (const entry of coverage) {

    if (!entry.url.startsWith('http')) continue;
    
    try {
      const converter = v8toIstanbul(entry.url);
      await converter.load();

      converter.applyCoverage(entry.functions);
      
      const istanbulData = converter.toIstanbul();
      const fileName = path.basename(entry.url) || 'index';
      fs.writeFileSync(
        path.join(reportPath, `coverage-${fileName}-${Date.now()}.json`), 
        JSON.stringify(istanbulData)
      );
    } catch (err) {
      console.warn(`Could not process coverage for ${entry.url}:`, err);
    }
  }
}