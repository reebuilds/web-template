#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const LAMBDA_DIR = path.join(__dirname, '../../lambda');
const SOURCE_DIR = path.join(__dirname, '..');
const SOURCE_FOLDERS = ['models', 'utils', 'services'];
const DEPLOY_DIR = path.join(LAMBDA_DIR, 'deploy');

// Ensure base Lambda directory exists
function ensureDirectories() {
  console.log('Creating necessary directories...');
  
  // Create Lambda base directory if it doesn't exist
  if (!fs.existsSync(LAMBDA_DIR)) {
    fs.mkdirSync(LAMBDA_DIR, { recursive: true });
    console.log(`✓ Created lambda directory at ${LAMBDA_DIR}`);
  }
  
  // Create lambda dist directory
  if (!fs.existsSync(path.join(LAMBDA_DIR, 'dist'))) {
    fs.mkdirSync(path.join(LAMBDA_DIR, 'dist'), { recursive: true });
    console.log(`✓ Created lambda dist directory`);
  }
  
  // Create deploy directory
  if (!fs.existsSync(DEPLOY_DIR)) {
    fs.mkdirSync(DEPLOY_DIR, { recursive: true });
    console.log(`✓ Created deploy directory`);
  }
  
  // Create required directories for source folders
  for (const folder of SOURCE_FOLDERS) {
    const destPath = path.join(LAMBDA_DIR, folder);
    
    // Force remove if exists and recreate
    if (fs.existsSync(destPath)) {
      fs.rmSync(destPath, { recursive: true, force: true });
      console.log(`✓ Removed existing directory for ${folder}`);
    }
    
    fs.mkdirSync(destPath, { recursive: true });
    console.log(`✓ Created directory for ${folder}`);
  }
}

// Copy source folders to lambda directory using native Node.js methods
function copySourceFolders() {
  console.log('\nCopying source folders to lambda directory...');
  for (const folder of SOURCE_FOLDERS) {
    const sourcePath = path.join(SOURCE_DIR, folder);
    const destPath = path.join(LAMBDA_DIR, folder);
    
    // Check if source folder exists
    if (fs.existsSync(sourcePath) && fs.statSync(sourcePath).isDirectory()) {
      try {
        // Copy files recursively using Node.js fs functions instead of shell command
        copyDirectoryRecursive(sourcePath, destPath);
        console.log(`✓ Copied ${folder}`);
      } catch (error) {
        console.error(`✗ Error copying ${folder}: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.warn(`⚠ Warning: Source folder ${folder} does not exist or is not a directory, skipping...`);
    }
  }
}

// Helper function to copy directories recursively
function copyDirectoryRecursive(source, destination) {
  // Read all files/directories from source
  const entries = fs.readdirSync(source, { withFileTypes: true });
  
  // Process each file/directory
  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);
    
    if (entry.isDirectory()) {
      // Create directory if it doesn't exist
      if (!fs.existsSync(destPath)) {
        fs.mkdirSync(destPath, { recursive: true });
      }
      // Recursive copy for subdirectories
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      // Copy file
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Check for package.json and tsconfig.json, create if needed
function ensureConfigFiles() {
  console.log('\nChecking for Lambda configuration files...');
  
  // Check for package.json
  const packageJsonPath = path.join(LAMBDA_DIR, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log('Creating default package.json...');
    const packageJson = {
      "name": "user-count-report-lambda",
      "version": "1.0.0",
      "description": "Lambda function to generate user count reports",
      "main": "dist/userCountReport.js",
      "scripts": {
        "build": "tsc"
      },
      "dependencies": {
        "mongoose": "^7.5.2"
      },
      "devDependencies": {
        "@types/aws-lambda": "^8.10.119",
        "@types/node": "^20.6.0",
        "typescript": "^5.2.2"
      }
    };
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✓ Created package.json');
  }
  
  // Check for tsconfig.json
  const tsconfigPath = path.join(LAMBDA_DIR, 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    console.log('Creating default tsconfig.json...');
    const tsconfig = {
      "compilerOptions": {
        "target": "es2020",
        "module": "commonjs",
        "outDir": "./dist",
        "strict": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true,
        "moduleResolution": "node",
        "resolveJsonModule": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    };
    fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    console.log('✓ Created tsconfig.json');
  }
  
  // Check for lambda handler
  const srcDir = path.join(LAMBDA_DIR, 'src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
  }
}

// Install dependencies
function installDependencies() {
  console.log('\nInstalling dependencies...');
  try {
    execSync('npm install', { cwd: LAMBDA_DIR, stdio: 'inherit' });
    console.log('✓ Dependencies installed successfully');
  } catch (error) {
    console.error(`✗ Error installing dependencies: ${error.message}`);
    process.exit(1);
  }
}

// Build TypeScript
function buildTypeScript() {
  console.log('\nBuilding TypeScript...');
  try {
    execSync('npm run build', { cwd: LAMBDA_DIR, stdio: 'inherit' });
    console.log('✓ TypeScript build completed successfully');
  } catch (error) {
    console.error(`✗ Error building TypeScript: ${error.message}`);
    console.log('Continuing with packaging despite build errors...');
  }
}

// Create deployment package
function createPackage() {
  console.log('\nCreating deployment package...');
  
  try {
    const zipFile = path.join(DEPLOY_DIR, 'lambda-function.zip');
    // Remove existing zip file if it exists
    if (fs.existsSync(zipFile)) {
      fs.unlinkSync(zipFile);
    }
    
    // Create zip file - use absolute paths with quotes to handle spaces in paths
    const lambdaDirQuoted = `"${LAMBDA_DIR}"`;
    const zipFileQuoted = `"${zipFile}"`;
    execSync(`cd ${lambdaDirQuoted} && zip -r ${zipFileQuoted} dist node_modules package.json`, { shell: true });
    console.log(`✓ Lambda package created at lambda/deploy/lambda-function.zip`);
  } catch (error) {
    console.error(`✗ Error creating deployment package: ${error.message}`);
    if (error.stderr) {
      console.error(`  ${error.stderr.toString()}`);
    }
    process.exit(1);
  }
}

// Main function
function packageLambda() {
  try {
    ensureDirectories();
    ensureConfigFiles();
    copySourceFolders();
    installDependencies();
    buildTypeScript();
    createPackage();
    console.log('\n✅ Lambda packaging completed successfully!');
  } catch (error) {
    console.error(`\n❌ Lambda packaging failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
packageLambda(); 