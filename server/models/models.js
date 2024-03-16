import User from "./user.js";
import Event from "./event.js";
import Admin from "./admin.js";
import Questions from "./questions.js";
import Participation from "./participation.js";

// User-Participation (one-to-many)
User.hasMany(Participation, { foreignKey: "userId" });
Participation.belongsTo(User, { foreignKey: "userId" });

// Event-Participation (one-to-many)
Event.hasMany(Participation, { foreignKey: "eventId" });
Participation.belongsTo(Event, { foreignKey: "eventId" });

// Event-Questions (one-to-many)
Event.hasMany(Questions, { foreignKey: "eventId" });
Questions.belongsTo(Event, { foreignKey: "eventId" });

export { User, Event, Participation, Admin, Questions };
