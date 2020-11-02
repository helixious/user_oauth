export default (Sequelize, DataTypes) => Sequelize.define(
    'user_provider',
    {
        id: {
            type: DataTypes.FLOAT,
            allowNull: false,
            primaryKey: true,
            unique: true,
            field: 'provider_id'
        },
        user_id: {
            type: DataTypes.UUID,
            // defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            foreignKey: true,
            field: 'user_id'
        },
        name: {
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
    //     tableName: 'user_provider',
    //     classMethods: {
    //         associate: (models) => {
    //             models.UserProvider.belongsTo(models.User, {
    //                 as: 'User',
    //                 foreignKey: 'user_id',
    //                 otherKey: 'provider_id'
    //             });
    //         }
    //     }
    // }
);