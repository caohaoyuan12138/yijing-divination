const chokidar = require('chokidar');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const SRC_DIR = path.join(__dirname, 'src');
const BACKUP_DIR = path.join(__dirname, 'backups');
const DIST_DIR = path.join(__dirname, 'dist');

// 确保备份目录存在
fs.ensureDirSync(BACKUP_DIR);

// 获取时间戳
function getTimestamp() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

// 创建备份
function createBackup(reason = 'auto') {
  const timestamp = getTimestamp();
  const backupName = `backup_${reason}_${timestamp}`;
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  try {
    // 复制 src 目录
    fs.copySync(SRC_DIR, path.join(backupPath, 'src'));
    
    // 复制配置文件
    const configFiles = ['package.json', 'vite.config.ts', 'tailwind.config.js', 'tsconfig.json', 'index.html'];
    configFiles.forEach(file => {
      const src = path.join(__dirname, file);
      if (fs.existsSync(src)) {
        fs.copySync(src, path.join(backupPath, file));
      }
    });
    
    console.log(`✅ 备份创建成功: ${backupName}`);
    
    // 只保留最近 20 个备份
    cleanupOldBackups();
    
    return backupPath;
  } catch (error) {
    console.error('❌ 备份失败:', error.message);
    return null;
  }
}

// 清理旧备份
function cleanupOldBackups() {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(name => name.startsWith('backup_'))
      .sort()
      .reverse();
    
    if (backups.length > 20) {
      const toDelete = backups.slice(20);
      toDelete.forEach(name => {
        fs.removeSync(path.join(BACKUP_DIR, name));
        console.log(`🗑️  删除旧备份: ${name}`);
      });
    }
  } catch (error) {
    console.error('清理旧备份失败:', error.message);
  }
}

// 列出所有备份
function listBackups() {
  try {
    const backups = fs.readdirSync(BACKUP_DIR)
      .filter(name => name.startsWith('backup_'))
      .sort()
      .reverse();
    
    if (backups.length === 0) {
      console.log('📭 没有找到备份');
      return [];
    }
    
    console.log('\n📦 可用备份列表:');
    backups.forEach((name, index) => {
      const backupPath = path.join(BACKUP_DIR, name);
      const stat = fs.statSync(backupPath);
      console.log(`${index + 1}. ${name} (${stat.size} bytes)`);
    });
    
    return backups;
  } catch (error) {
    console.error('列出备份失败:', error.message);
    return [];
  }
}

// 恢复备份
function restoreBackup(backupName) {
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  if (!fs.existsSync(backupPath)) {
    console.error(`❌ 备份不存在: ${backupName}`);
    return false;
  }
  
  try {
    // 创建恢复前的备份
    createBackup('before_restore');
    
    // 恢复 src 目录
    const srcBackup = path.join(backupPath, 'src');
    if (fs.existsSync(srcBackup)) {
      fs.removeSync(SRC_DIR);
      fs.copySync(srcBackup, SRC_DIR);
    }
    
    // 恢复配置文件
    const configFiles = ['package.json', 'vite.config.ts', 'tailwind.config.js', 'tsconfig.json', 'index.html'];
    configFiles.forEach(file => {
      const src = path.join(backupPath, file);
      if (fs.existsSync(src)) {
        fs.copySync(src, path.join(__dirname, file));
      }
    });
    
    console.log(`✅ 恢复成功: ${backupName}`);
    return true;
  } catch (error) {
    console.error('❌ 恢复失败:', error.message);
    return false;
  }
}

// 命令行参数处理
const command = process.argv[2];

switch (command) {
  case 'backup':
    createBackup(process.argv[3] || 'manual');
    break;
    
  case 'list':
    listBackups();
    break;
    
  case 'restore':
    const backupName = process.argv[3];
    if (!backupName) {
      console.log('请指定备份名称，例如: node backup.js restore backup_auto_2024-01-01T12-00-00');
      listBackups();
    } else {
      restoreBackup(backupName);
    }
    break;
    
  case 'watch':
    console.log('👀 正在监听文件变化...');
    console.log(`监听目录: ${SRC_DIR}`);
    console.log(`备份目录: ${BACKUP_DIR}`);
    console.log('按 Ctrl+C 停止监听\n');
    
    const watcher = chokidar.watch(SRC_DIR, {
      ignored: /node_modules|\.git/,
      persistent: true,
      ignoreInitial: true,
    });
    
    let timeout = null;
    
    watcher.on('all', (event, path) => {
      console.log(`📝 文件变化: ${event} ${path}`);
      
      // 防抖：5秒内多次变化只备份一次
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        createBackup('auto');
      }, 5000);
    });
    
    watcher.on('error', (error) => {
      console.error('监听错误:', error);
    });
    
    // 每小时自动备份一次
    setInterval(() => {
      createBackup('hourly');
    }, 60 * 60 * 1000);
    
    break;
    
  default:
    console.log('🔄 代码自动备份系统');
    console.log('');
    console.log('使用方法:');
    console.log('  node backup.js backup [reason]   - 立即创建备份');
    console.log('  node backup.js list              - 列出所有备份');
    console.log('  node backup.js restore <name>    - 恢复指定备份');
    console.log('  node backup.js watch             - 监听文件变化自动备份');
    console.log('');
    console.log('示例:');
    console.log('  node backup.js backup before-big-change');
    console.log('  node backup.js restore backup_auto_2024-01-01T12-00-00');
}

module.exports = { createBackup, listBackups, restoreBackup };
