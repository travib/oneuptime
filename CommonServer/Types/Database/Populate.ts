import BaseModel from 'Common/Models/BaseModel';
import { JSONObject } from 'Common/Types/JSON';
import { FindOptionsRelations } from 'typeorm';

type Populate<TBaseModel extends BaseModel> =
    | FindOptionsRelations<TBaseModel>
    | JSONObject;

export default Populate;
