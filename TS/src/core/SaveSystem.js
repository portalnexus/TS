const fs = require('fs');
const path = require('path');

class SaveSystem {
  constructor() {
    this.saveDir = path.join(process.cwd(), 'saves');
    this.saveFile = path.join(this.saveDir, 'save_01.json');
    this.hallFile = path.join(this.saveDir, 'hall_of_fame.json');
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

  saveHallOfFame(entry) {
    const hall = this.loadHallOfFame();
    hall.push(entry);
    hall.sort((a, b) => b.prestige - a.prestige);
    try { fs.writeFileSync(this.hallFile, JSON.stringify(hall, null, 2), 'utf8'); } catch (e) {}
    return hall;
  }

  loadHallOfFame() {
    try {
      if (!fs.existsSync(this.hallFile)) return [];
      return JSON.parse(fs.readFileSync(this.hallFile, 'utf8'));
    } catch (e) { return []; }
  }

  deleteSave() {
    try {
      if (this.hasSave()) {
        fs.unlinkSync(this.saveFile);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Erro ao deletar save:', err);
      return false;
    }
  }
}

module.exports = new SaveSystem();
