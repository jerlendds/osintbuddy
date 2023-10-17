import json, ujson, datetime
from uuid import UUID
from sqlalchemy import Row

class SAEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Row):
            clean_sa_fields = lambda db_row: db_row if delattr(db_row, 'id') else db_row 
            sa_obj = clean_sa_fields(next(iter(obj._mapping.values())))

            fields = {}
            for field in [col for col in dir(sa_obj) if not col.startswith('_') and col != 'metadata' and col != 'registry' and col != 'id']:
                data = sa_obj.__getattribute__(field)
                try:
                    ujson.dumps(data)
                    fields[field] = data
                except TypeError as e:
                    if isinstance(sa_obj, datetime.datetime):
                        fields[field] = sa_obj.isoformat()
                    elif isinstance(sa_obj, UUID):
                        fields[field] = str(sa_obj)
                    else:
                        fields[field] = None
            return fields
        return json.JSONEncoder.default(self, sa_obj)