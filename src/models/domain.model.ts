import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/db.config';
import Link from './link.model';
import Queue from './queue.model';
import VisitedSite from './visitedSite.model';

/**
 * Define attributes for the Site model.
 */
interface DomainAttributes {
    name: string;
    lastVisited: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Define the optional fields for new entries.
 */
interface DomainCreationAttributes extends Optional<DomainAttributes, 'createdAt' | 'updatedAt'> {}

/**
 * Define the Site model.
 */
class Domain extends Model<DomainAttributes, DomainCreationAttributes> implements DomainAttributes {
    public name!: string;
    public lastVisited: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

/**
 * Initialize the model with Sequelize.
 */
Domain.init(
    {
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        lastVisited: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: true,
            validate: {
                isDate: true
            }
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
        tableName: 'domains',
        timestamps: true
    }
);

Domain.hasMany(Queue, { foreignKey: 'domain' });
Domain.hasMany(VisitedSite, { foreignKey: 'domain' });
Domain.hasMany(Link, { foreignKey: 'from' });
Domain.hasMany(Link, { foreignKey: 'to' });
Queue.belongsTo(Domain, { foreignKey: 'domain', targetKey: 'name', as: 'Domain' });
VisitedSite.belongsTo(Domain, { foreignKey: 'domain', targetKey: 'name', as: 'Domain' });
Link.belongsTo(Domain, { foreignKey: 'from', targetKey: 'name', as: 'FromDomain' });
Link.belongsTo(Domain, { foreignKey: 'to', targetKey: 'name', as: 'ToDomain' });

export default Domain;
