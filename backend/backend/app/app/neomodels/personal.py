from neomodel import StructuredNode, StringProperty, ArrayProperty, RelationshipTo, RelationshipFrom, IntegerProperty, DateTimeProperty


class Person(StructuredNode):
    first_name = StringProperty()
    middle_name = StringProperty()
    last_name = StringProperty()
    other_name = StringProperty()
    nickname = StringProperty()
    age = IntegerProperty()
    date_of_birth = StringProperty()


class Username(StructuredNode):
    username = StringProperty()
    platform = StringProperty()
    profile_url = StringProperty()


class Email(StructuredNode):
    email = StringProperty()
