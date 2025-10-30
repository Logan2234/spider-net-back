import { DataTypes, Model, Optional } from 'sequelize';
import Sequelize from '../configs/db';
import Link from './link.model';
import Queue from './queue.model';
import VisitedSite from './visitedSite.model';

/**
 * Define attributes for the Site model.
 */
interface DomainAttributes {
  name: string;
  lastVisited: Date | null;
  nbVisits?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Define the optional fields for new entries.
 */
type DomainCreationAttributes = Optional<
  DomainAttributes,
  'createdAt' | 'updatedAt' | 'nbVisits'
>;

/**
 * Define the Site model.
 */
class Domain
  extends Model<DomainAttributes, DomainCreationAttributes>
  implements DomainAttributes
{
  public name!: string;
  public nbVisits!: number;
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
      unique: true,
      validate: {
        notEmpty: true,
        isLowercase: true
      }
    },
    lastVisited: {
      type: DataTypes.DATE,
      defaultValue: null,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    nbVisits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        min: 0,
        isNumeric: true
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
    sequelize: Sequelize,
    tableName: 'domains',
    timestamps: true
  }
);

Domain.hasMany(Queue, { foreignKey: 'domain' });
const VisitedSiteBelongsToDomain = Domain.hasMany(VisitedSite, {
  foreignKey: 'domain',
  as: 'visitedSites'
});
Domain.hasMany(Link, { foreignKey: 'from' });
Domain.hasMany(Link, { foreignKey: 'to' });
const QueueBelongsToDomain = Queue.belongsTo(Domain, {
  foreignKey: 'domain',
  targetKey: 'name',
  as: 'Domain'
});
VisitedSite.belongsTo(Domain, {
  foreignKey: 'domain',
  targetKey: 'name',
  as: 'Domain'
});
Link.belongsTo(Domain, {
  foreignKey: 'from',
  targetKey: 'name',
  as: 'FromDomain'
});
Link.belongsTo(Domain, { foreignKey: 'to', targetKey: 'name', as: 'ToDomain' });

export default Domain;
export { QueueBelongsToDomain, VisitedSiteBelongsToDomain };
