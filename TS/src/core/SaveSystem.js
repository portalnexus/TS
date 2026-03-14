const fs = require('fs');
const path = require('path');

class SaveSystem {
  constructor() {
    this.saveDir = path.join(process.cwd(), 'saves');
    this.saveFile = path.join(this.saveDir, 'save_01.json');
    this.ensureSaveDir();
  }

  ensureSaveDir() {
    if (!fs.existsSync(this.saveDir)) {
      fs.mkdirSync(this.saveDir);
    }
  }

  save(playerData) {
    try {
      const data = JSON.stringify(playerData, null, 2);
      fs.writeFileSync(this.saveFile, data, 'utf8');
      return true;
    } catch (err) {
      console.error('Erro ao salvar:', err);
      return false;
    }
  }

  load() {
    try {
      if (!fs.existsSync(this.saveFile)) return null;
      const data = fs.readFileSync(this.saveFile, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Erro ao carregar:', err);
      return null;
    }
  }

  hasSave() {
    return fs.existsSync(this.saveFile);
  }
}

module.exports = new SaveSystem();
