const fs = require('fs');
const path = require('path');

// Функция для поиска всех .vue файлов
function findVueFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findVueFiles(fullPath));
    } else if (item.endsWith('.vue')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Функция для проверки, использует ли файл SCSS переменные
function usesScssVariables(content) {
  return /\$[a-zA-Z-]+/.test(content);
}

// Функция для проверки, есть ли уже импорт переменных
function hasVariablesImport(content) {
  return /@use.*variables\.scss|@import.*variables\.scss/.test(content);
}

// Функция для добавления импорта
function addVariablesImport(content) {
  const styleMatch = content.match(/<style[^>]*lang="scss"[^>]*>/);
  if (styleMatch) {
    const importLine = "@use '@/assets/styles/variables.scss' as *;\n";
    return content.replace(styleMatch[0], styleMatch[0] + importLine);
  }
  return content;
}

// Основная функция
function fixScssImports() {
  const vueFiles = findVueFiles('./components');
  const pageFiles = findVueFiles('./pages');
  const allFiles = [...vueFiles, ...pageFiles];

  let fixedCount = 0;

  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8');

      if (usesScssVariables(content) && !hasVariablesImport(content)) {
        const newContent = addVariablesImport(content);
        if (newContent !== content) {
          fs.writeFileSync(file, newContent, 'utf8');
          console.log(`Fixed: ${file}`);
          fixedCount++;
        }
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`Fixed ${fixedCount} files`);
}

fixScssImports();
