import {DataTypes, Sequelize} from "sequelize";

const database = new Sequelize('postgresql://postgres:password@localhost:5432/snaplan_rtt', {
    logging: false
});

try {
    database.authenticate().then(() => console.log('Connection has been established successfully.'));
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export const User = database.define('User', {
    id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    displayName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    joined: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

export const Score = database.define('Score', {
    scoreId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    leaderboardId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    score: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    timeSet: {
        type: DataTypes.DATE,
        allowNull: false
    }
});

export const Leaderboard = database.define('Leaderboard', {
    leaderboardId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bsrKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    maxScore: {
        type: DataTypes.BIGINT,
        allowNull: false,
    }
});

export const Team = database.define('Team', {
    teamId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
});

export const Round = database.define('Round', {
    roundId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    roundTitle: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    }
});

// Relations
User.hasMany(Score, {as: 'scores', foreignKey: 'userId'});
Score.belongsTo(User, {as: 'user', foreignKey: 'userId'});

User.belongsToMany(Team, {as: 'teams', through: 'User_Teams'});
Team.belongsToMany(User, {as: 'users', through: 'User_Teams'});

Round.hasMany(Team, {as: 'teams', foreignKey: 'roundId'});
Team.belongsTo(Round, {as: 'round', foreignKey: 'roundId'});

Round.belongsToMany(Leaderboard, {as: 'leaderboards', through: 'Round_Leaderboards'});
Leaderboard.belongsToMany(Round, {as: 'rounds', through: 'Round_Leaderboards'});

database.sync({alter: true}).then(() => console.log("All models were synchronized successfully."));
// await database.sync({force: true});
console.log("DB initialized!");

export default database;