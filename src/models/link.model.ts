import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/db.config';
import Domain from './domain.model';

/**
 * Define attributes for the Link model.
 */
interface LinkAttributes {
    from: string;
    to: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Define the optional fields for new entries.
 */
interface LinkCreationAttributes extends Optional<LinkAttributes, 'createdAt' | 'updatedAt'> {}

/**
 * Define the Link model.
 */
class Link extends Model<LinkAttributes, LinkCreationAttributes> implements LinkAttributes {
    public from!: string;
    public to!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly FromDomain?: Domain;
    public readonly ToDomain?: Domain;
}

/**
 * Initialize the model with Sequelize.
 */
Link.init(
    {
        from: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        to: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        sequelize,
        tableName: 'links',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['from', 'to']
            }
        ]
    }
);

export default Link;
