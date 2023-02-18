from neomodel import StructuredNode, StringProperty, ArrayProperty, RelationshipTo, RelationshipFrom, IntegerProperty, DateTimeProperty, FloatProperty


class Coordinates(StructuredNode):
    latitude = FloatProperty()
    longitude = FloatProperty()


class Address(StructuredNode):
    city = StringProperty()
    country = StringProperty()
    postal = StringProperty()
    state = StringProperty()
    timezone = StringProperty()
