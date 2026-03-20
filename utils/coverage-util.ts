import v8toIstanbul from 'v8-to-istanbul';
import fs from 'fs';
import path from 'path';

export async function saveCoverage(coverage: any[]) {
  const reportPath = path.join(process.cwd(), 'coverage');
  if (!fs.existsSync(reportPath)) fs.mkdirSync(reportPath);

  for (const entry of coverage) {
    
    if (!entry.url.includes('localhost') && !entry.url.includes('your-app-domain')) continue;
    
    const converter = v8toIstanbul(entry.url);
    await converter.load();
    converter.applyCoverage(entry.functions);
    
    // 生成 istanbul 格式的 JSON
    const istanbulData = converter.toIstanbul();
    fs.writeFileSync(
      path.join(reportPath, `coverage-${Date.now()}.json`), 
      JSON.stringify(istanbulData)
    );
  }
}