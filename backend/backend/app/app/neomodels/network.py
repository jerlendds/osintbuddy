from neomodel import StructuredNode, StringProperty, ArrayProperty, RelationshipTo, RelationshipFrom, IntegerProperty, DateTimeProperty


class DNS(StructuredNode):
    value = StringProperty()
    dns_type = StringProperty(
        choices={
            "NS": "NS",
            "A": "A",
            "AAAA": "AAAA",
            "MX": "MX",
            "CNAME": "CNAME",
            "TXT": "TXT",
            "PTR": "PTR",
            "SRV": "SRV",
            "CERT": "CERT",
            "DCHID": "DCHID",
            "DNAME": "DNAME",
            "SOA": "SOA"
        }
    )


class IP(StructuredNode):
    value = StringProperty()
    ip_type = StringProperty()  # ipv4 or ipv6


# can include "www."
class Domain(StructuredNode):
    name = StringProperty()


# do not include "www."
class Subdomain(StructuredNode):
    name = StringProperty()


class IpNetblock(StructuredNode):
    route = StringProperty()


class URL(StructuredNode):
    url = StringProperty()
