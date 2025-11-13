import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Import model definitions
import ApiKeyModel from "./apikey.model.js";
import EventModel from "./event.model.js";

const db = {};

// Add Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize models
db.ApiKey = ApiKeyModel(sequelize, DataTypes);
db.Event = EventModel(sequelize, DataTypes);

// Relationships
db.ApiKey.hasMany(db.Event, {
  foreignKey: "apiKey",
  sourceKey: "apiKey",
});

db.Event.belongsTo(db.ApiKey, {
  foreignKey: "apiKey",
  targetKey: "apiKey",
});

export default db;
