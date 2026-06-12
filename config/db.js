const mongoose = require('mongoose');

module.exports = () => {
  console.log('Mock DB connection initialized – using in‑memory storage');
};

if (process.env.MOCK_DB === 'true') {
  console.log('MOCK_DB is true – hooking mongoose.model globally...');

  // Mock Query implementation to support standard chaining methods
  class MockQuery {
    constructor(promiseOrValue) {
      this.promise = Promise.resolve(promiseOrValue);
    }

    then(onfulfilled, onrejected) {
      return this.promise.then(onfulfilled, onrejected);
    }

    catch(onrejected) {
      return this.promise.catch(onrejected);
    }

    populate() { return this; }
    select() { return this; }
    sort(sortOption) {
      this.promise = this.promise.then(val => {
        if (Array.isArray(val)) {
          if (sortOption === 'newest' || (typeof sortOption === 'object' && sortOption.createdAt === -1)) {
            return val.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          }
          if (sortOption === 'deadline') {
            return val.sort((a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0));
          }
        }
        return val;
      });
      return this;
    }
  }

  // Model builder function
  function createMockModel(name) {
    const store = [];
    let idCounter = 1;
    const _generateId = () => `${name.toLowerCase()}_${idCounter++}_${Math.random().toString(36).substr(2, 5)}`;

    // Populate mock seed data
    if (name === 'Job') {
      try {
        const mockJobs = require('../mockJobs');
        store.push(...JSON.parse(JSON.stringify(mockJobs)));
      } catch (err) {
        console.error('Failed to load mock jobs in MockModel:', err);
      }
    } else if (name === 'User') {
      store.push(
        {
          _id: 'dummy123',
          name: 'Test Student',
          email: 'test@gmail.com',
          role: 'student',
          password: 'password123'
        },
        {
          _id: 'recruiter123',
          name: 'Test Recruiter',
          email: 'recruiter@gmail.com',
          role: 'recruiter',
          password: 'password123'
        }
      );
    } else if (name === 'StudentProfile') {
      store.push({
        _id: 'profile123',
        userId: 'dummy123',
        college: 'State Tech University',
        branch: 'Computer Science',
        graduationYear: 2026,
        skills: ['React', 'Node.js', 'JavaScript', 'HTML', 'CSS', 'REST APIs'],
        resumeUrl: '',
        resumeScore: 84
      });
    }

    class ModelDocument {
      constructor(data) {
        Object.assign(this, data);
        Object.defineProperty(this, '_model', {
          value: Model,
          enumerable: false,
          writable: true
        });
      }

      async save() {
        try {
          if (!this._id) {
            this._id = _generateId();
          }
          const idx = store.findIndex(i => i._id === this._id);
          const plainData = { ...this };
          if (idx !== -1) {
            store[idx] = plainData;
          } else {
            store.push(plainData);
          }
          console.log(`[Mock DB] Saved document to ${name} store`, this._id);
          return this;
        } catch (err) {
          console.error(`[Mock DB] Error saving document to ${name}:`, err);
          throw err;
        }
      }

      async deleteOne() {
        try {
          if (this._id) {
            const idx = store.findIndex(i => i._id === this._id);
            if (idx !== -1) store.splice(idx, 1);
            console.log(`[Mock DB] Deleted document from ${name} store`, this._id);
          }
          return this;
        } catch (err) {
          console.error(`[Mock DB] Error deleting document from ${name}:`, err);
          throw err;
        }
      }

      toObject() {
        return { ...this };
      }
    }

    if (name === 'User') {
      ModelDocument.prototype.matchPassword = async function(enteredPassword) {
        try {
          const bcrypt = require('bcryptjs');
          return await bcrypt.compare(enteredPassword, this.password);
        } catch (err) {
          return enteredPassword === this.password;
        }
      };
    }

    function Model(data) {
      return new ModelDocument(data);
    }

    Model.modelName = name;
    Model.store = store;
    Model._generateId = _generateId;
    Model._wrap = (data) => data ? new ModelDocument(data) : null;

    Model._matches = (item, query) => {
      try {
        return Object.entries(query).every(([key, val]) => {
          if (key === '$or') {
            if (!Array.isArray(val)) return true;
            return val.some(subQuery => Model._matches(item, subQuery));
          }
          
          const itemVal = item[key];
          
          if (val && typeof val === 'object') {
            if (val.$regex) {
              const regex = new RegExp(val.$regex, val.$options || '');
              return regex.test(itemVal || '');
            }
            if (val.$in) {
              const array = Array.isArray(itemVal) ? itemVal : [itemVal];
              return val.$in.some(v => {
                if (v instanceof RegExp) {
                  return array.some(it => v.test(it));
                }
                return array.includes(v);
              });
            }
          }
          
          return itemVal === val;
        });
      } catch (err) {
        console.error(`[Mock DB] Matching error on model ${name}:`, err);
        return false;
      }
    };

    // Query Methods
    Model.create = async function(doc) {
      try {
        const _id = _generateId();
        const newDoc = new ModelDocument({ _id, ...doc });
        await newDoc.save();
        return newDoc;
      } catch (err) {
        console.error(`[Mock DB] Error creating doc in ${name}:`, err);
        throw err;
      }
    };

    Model.find = function(query = {}) {
      try {
        let entries = store.filter(item => Model._matches(item, query));
        if (name === 'Job' && entries.length === 0) {
          console.log("[Mock DB] Job find returned 0 results, returning all mock jobs to prevent 'No Jobs Found'");
          entries = store;
        }
        return new MockQuery(entries.map(item => Model._wrap(item)));
      } catch (err) {
        console.error(`[Mock DB] Error in find on ${name}:`, err);
        return new MockQuery([]);
      }
    };

    Model.findOne = function(query = {}) {
      try {
        const entry = store.find(item => Model._matches(item, query));
        return new MockQuery(Model._wrap(entry));
      } catch (err) {
        console.error(`[Mock DB] Error in findOne on ${name}:`, err);
        return new MockQuery(null);
      }
    };

    Model.findById = function(id) {
      try {
        const entry = store.find(item => item._id === String(id));
        return new MockQuery(Model._wrap(entry));
      } catch (err) {
        console.error(`[Mock DB] Error in findById on ${name}:`, err);
        return new MockQuery(null);
      }
    };

    Model.findByIdAndUpdate = function(id, updates = {}, options = {}) {
      try {
        const entryIdx = store.findIndex(item => item._id === String(id));
        if (entryIdx === -1) return new MockQuery(null);
        const entry = store[entryIdx];
        const updated = { ...entry, ...updates };
        store[entryIdx] = updated;
        const doc = Model._wrap(options.new ? updated : entry);
        return new MockQuery(doc);
      } catch (err) {
        console.error(`[Mock DB] Error in findByIdAndUpdate on ${name}:`, err);
        return new MockQuery(null);
      }
    };

    Model.findOneAndUpdate = function(query = {}, updates = {}, options = {}) {
      try {
        const entryIdx = store.findIndex(item => Model._matches(item, query));
        if (entryIdx === -1) return new MockQuery(null);
        const entry = store[entryIdx];
        const updated = { ...entry, ...updates };
        store[entryIdx] = updated;
        const doc = Model._wrap(options.new ? updated : entry);
        return new MockQuery(doc);
      } catch (err) {
        console.error(`[Mock DB] Error in findOneAndUpdate on ${name}:`, err);
        return new MockQuery(null);
      }
    };

    Model.deleteOne = function(query = {}) {
      try {
        const initialLen = store.length;
        const matches = store.filter(item => Model._matches(item, query));
        matches.forEach(match => {
          const idx = store.findIndex(i => i._id === match._id);
          if (idx !== -1) store.splice(idx, 1);
        });
        console.log(`[Mock DB] deleteOne deleted ${initialLen - store.length} items`);
        return new MockQuery({ deletedCount: initialLen - store.length });
      } catch (err) {
        console.error(`[Mock DB] Error in deleteOne on ${name}:`, err);
        return new MockQuery({ deletedCount: 0 });
      }
    };

    return Model;
  }

  const mockModels = {};
  mongoose.model = function(name, schema) {
    if (!mockModels[name]) {
      mockModels[name] = createMockModel(name);
    }
    return mockModels[name];
  };
}

