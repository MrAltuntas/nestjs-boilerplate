const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Ana schema template'i
const baseSchema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Models are imported from module schemas
// To regenerate: npm run schema:build

`;

// Tüm schema dosyalarını bul
const schemaFiles = glob.sync('src/**/schemas/*.prisma');

// Schema dosyalarının içeriğini oku
let modelsContent = '';
schemaFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  modelsContent += content + '\n\n';
});

// Ana schema dosyasını güncelle
const finalSchema = baseSchema + modelsContent;
fs.writeFileSync('prisma/schema.prisma', finalSchema);

console.log('✅ Schema built successfully!');
console.log(`📁 Found ${schemaFiles.length} schema files:`);
schemaFiles.forEach(file => console.log(`   - ${file}`));