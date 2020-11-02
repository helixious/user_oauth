export default (Sequelize, DataTypes) => Sequelize.define(
    'user',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            // allowNull: false,
            primaryKey: true,
            unique: true,
            // autoIncrement: true,
            field: 'user_id'
        },
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        last_updated: {
            type: 'TIMESTAMP',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        }
    },
    // {
    //     tableName: 'user',
    //     classMethods: {
    //         associate: (models) => {
    //             models.User.hasMany(models.Provider, {
    //                 as: 'Providers',
    //                 through: 'user_provider',
    //                 foreignKey: 'user_id',
    //                 otherKey: 'provider_id'
    //             });
    //         }
    //     }
    // }
    );

    // User.hasMany(UserProvider, {as: 'provider', foreignKey: 'user_id'});
    // UserProvider.belongsTo(User, {as: 'user', foreignKey: 'user_id'});