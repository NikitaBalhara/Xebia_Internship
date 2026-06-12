// backend/models/mockModel.js
// Very lightweight in‑memory mock that mimics a subset of Mongoose Model API used in the project.
// It stores records in an internal array and returns Promises so the async/await flow works unchanged.

let idCounter = 1;

class MockModel {
  constructor(name) {
    this.name = name;
    this.store = [];
  }

  // Helper to generate a simple ObjectId‑like string
  _generateId() {
    return (idCounter++).toString();
  }

  async create(doc) {
    const _id = this._generateId();
    const newDoc = { _id, ...doc };
    this.store.push(newDoc);
    return newDoc;
  }

  async find(query = {}) {
    // shallow equality matching for simple fields
    const entries = this.store.filter((item) => {
      return Object.entries(query).every(([k, v]) => {
        if (v && typeof v === 'object' && v.$in) {
          return v.$in.includes(item[k]);
        }
        return item[k] === v;
      });
    });
    return entries;
  }

  async findOne(query = {}) {
    const entry = this.store.find((item) => {
      return Object.entries(query).every(([k, v]) => item[k] === v);
    });
    return entry || null;
  }

  async findById(id) {
    return this.store.find((item) => item._id === id) || null;
  }

  async findByIdAndUpdate(id, updates = {}, options = {}) {
    const doc = await this.findById(id);
    if (!doc) return null;
    const updated = { ...doc, ...updates };
    // replace in store
    const idx = this.store.findIndex((i) => i._id === id);
    this.store[idx] = updated;
    return options.new ? updated : doc;
  }

  // Used in authController for password select false handling – simply return full doc
  async findOneAndUpdate() { return null; }
}

module.exports = MockModel;
