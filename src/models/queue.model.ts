import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/db.config';
import { SiteState } from '../enums/siteState';
import Domain from './domain.model';

/**
 * Define attributes for the Queue model.
 */
interface QueueAttributes {
    url: string;
    domain: string;
    priority: number;
    state: SiteState;
    depth: number;
    errorMessage?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Define the optional fields for new entries.
 */
interface QueueCreationAttributes
    extends Optional<QueueAttributes, 'errorMessage' | 'createdAt' | 'updatedAt'> {}

/**
 * Define the Queue model.
 */
class Queue extends Model<QueueAttributes, QueueCreationAttributes> implements QueueAttributes {
    public url!: string;
    public domain!: string;
    public priority!: number;
    public state!: SiteState;
    public depth!: number;
    public errorMessage?: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly Domain?: Domain;
}

/**
 * Initialize the model with Sequelize.
 */
Queue.init(
    {
        url: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
            unique: true,
            validate: {
                isUrl: true
            }
        },
        priority: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isNumeric: true
            }
        },
        depth: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                isNumeric: true
            }
        },
        state: {
            type: DataTypes.ENUM,
            values: Object.values(SiteState),
            allowNull: false,
            defaultValue: SiteState.UNPROCESSED,
            validate: {
                isIn: [Object.values(SiteState)]
            }
        },
        domain: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        errorMessage: {
            type: DataTypes.TEXT,
            allowNull: true
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
        tableName: 'queue',
        timestamps: true
    }
);

export default Queue;
