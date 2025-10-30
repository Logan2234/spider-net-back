import { DataTypes, Model, Optional } from 'sequelize';
import Sequelize from '../configs/db';
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
type VisitedSiteCreationAttributes = Optional<
  VisitedSiteAttributes,
  'createdAt' | 'updatedAt'
>;

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
      allowNull: false,
      validate: {
        notEmpty: true,
        isLowercase: true
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
    tableName: 'visited_sites',
    timestamps: true
  }
);

export default VisitedSite;
