import User from "./user.js";
import Team from "./team.js";
import Event from "./event.js";
import Admin from "./admin.js";
import Participation from "./participation.js";

// User-Team (one-to-many)
User.belongsTo(Team, { foreignKey: "currentTeamId" });
Team.hasMany(User, { foreignKey: "currentTeamId" });

// User-Participation (one-to-many)
User.hasMany(Participation, { foreignKey: "userId" });
Participation.belongsTo(User, { foreignKey: "userId" });

// Team-Participation (one-to-many)
Team.hasMany(Participation, { foreignKey: "teamId" });
Participation.belongsTo(Team, { foreignKey: "teamId" });

// Event-Participation (one-to-many)
Event.hasMany(Participation, { foreignKey: "eventId" });
Participation.belongsTo(Event, { foreignKey: "eventId" });

export { User, Team, Event, Participation, Admin };
