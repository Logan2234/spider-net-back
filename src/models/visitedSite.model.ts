import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/db.config';
import Domain from './domain.model';

/**
 * Define attributes for the VisitedSite model.
 */
interface VisitedSiteAttributes {
    url: string;
    domain: string;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Define the optional fields for new entries.
 */
interface VisitedSiteCreationAttributes
    extends Optional<VisitedSiteAttributes, 'createdAt' | 'updatedAt'> {}

/**
 * Define the VisitedSite model.
 */
class VisitedSite
    extends Model<VisitedSiteAttributes, VisitedSiteCreationAttributes>
    implements VisitedSiteAttributes
{
    public url!: string;
    public domain!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public readonly Domain?: Domain;
}

/**
 * Initialize the model with Sequelize.
 */
VisitedSite.init(
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
        domain: {
            type: DataTypes.TEXT,
            allowNull: false
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
        tableName: 'visited_sites',
        timestamps: true
    }
);

export default VisitedSite;
